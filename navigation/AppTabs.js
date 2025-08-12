import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder, Dimensions, TextInput, Modal, Alert } from 'react-native';
import Svg, { Line, Defs, Marker } from 'react-native-svg';
import { createClient } from '@supabase/supabase-js';

// The global variables are provided by the canvas environment
const __app_id = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// IMPORTANT: Assuming a masterClient.js file exists, we'll recreate the client here
// with the credentials you provided.
const masterSupabase = createClient(
  'https://kyaaknsamvocksxzbasz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5YWFrbnNhbXZvY2tzeHpiYXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDA3ODUsImV4cCI6MjA3MDQxNjc4NX0.Iv8rOwIvtvkkmgazE5z0caGHSf1WLo_VVx74PonyObk'
);

// This is a placeholder for a global session or context.
const mockUserSession = {
  user: {
    id: 'user-123', // In a real scenario, this would be a real user ID
  },
};

const windowHeight = Dimensions.get('window').height;

export function ChatFlowBuilderScreen() {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editNode, setEditNode] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newConnectionSource, setNewConnectionSource] = useState(null);
  const botSupabaseRef = useRef(null);
  const companyIdRef = useRef(null);
  const channelRef = useRef(null);
  const isSavingRef = useRef(false);

  // A debounced save function to prevent excessive database writes
  const debouncedSaveFlow = useRef(
    (currentNodes, currentConnections) => {
      if (isSavingRef.current) return;
      isSavingRef.current = true;
      setTimeout(async () => {
        try {
          if (!botSupabaseRef.current || !companyIdRef.current) {
            console.error('Supabase client or company ID not ready.');
            isSavingRef.current = false;
            return;
          }

          const flowData = { nodes: currentNodes, connections: currentConnections };

          const { error: upsertError } = await botSupabaseRef.current
            .from('chat_flows')
            .upsert({ company_id: companyIdRef.current, flow_data: flowData }, { onConflict: 'company_id' });

          if (upsertError) throw upsertError;
          console.log('Flow saved successfully!');
        } catch (e) {
          console.error('Error saving flow:', e);
          setError(`Failed to save flow: ${e.message}`);
        } finally {
          isSavingRef.current = false;
        }
      }, 500); // 500ms debounce
    }
  ).current;

  // Initialize Supabase client and subscribe to real-time changes
  useEffect(() => {
    const fetchAndListen = async () => {
      setLoading(true);
      setError(null);

      const userId = mockUserSession.user.id;

      try {
        // Step 1: Fetch bot's credentials and bot_id from the master database
        const { data: botCredentials, error: credentialsError } = await masterSupabase
          .from('bots')
          .select('id, supabase_url, supabase_anon_key')
          .eq('user_id', userId)
          .maybeSingle();

        if (credentialsError) throw credentialsError;
        if (!botCredentials) throw new Error("No bot found for this user.");

        // Step 2: Create a dynamic Supabase client for the specific bot's database
        botSupabaseRef.current = createClient(botCredentials.supabase_url, botCredentials.supabase_anon_key);

        // Step 3: Fetch company ID from the bot's database using the bot_id
        const { data: companyData, error: companyError } = await botSupabaseRef.current
          .from('companies')
          .select('id')
          .eq('bot_id', botCredentials.id)
          .maybeSingle();

        if (companyError) throw companyError;
        if (!companyData || !companyData.id) throw new Error("Could not find company ID for this bot.");
        companyIdRef.current = companyData.id;

        // Step 4: Set up a real-time subscription for the chat_flows table
        channelRef.current = botSupabaseRef.current
          .channel('chat_flow_changes')
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'chat_flows',
            filter: `company_id=eq.${companyIdRef.current}`,
          }, (payload) => {
            const { nodes: newNodes, connections: newConnections } = payload.new.flow_data;
            setNodes(newNodes);
            setConnections(newConnections);
          })
          .subscribe();

        // Step 5: Fetch initial data
        const { data: flowData, error: flowError } = await botSupabaseRef.current
          .from('chat_flows')
          .select('flow_data')
          .eq('company_id', companyIdRef.current)
          .maybeSingle();

        if (flowError) throw flowError;

        if (flowData && flowData.flow_data) {
          const { nodes: savedNodes, connections: savedConnections } = flowData.flow_data;
          setNodes(savedNodes || []);
          setConnections(savedConnections || []);
        } else {
          setNodes([]);
          setConnections([]);
        }

      } catch (e) {
        console.error('Supabase initialization or data fetch failed:', e);
        setError(`Failed to initialize the app: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAndListen();

    return () => {
      if (channelRef.current && botSupabaseRef.current) {
        botSupabaseRef.current.removeChannel(channelRef.current);
      }
    };
  }, []);

  const addNode = useCallback(() => {
    const newNode = {
      id: `node-${Date.now()}`,
      x: 50,
      y: 50,
      text: `New Node`,
    };
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    debouncedSaveFlow(updatedNodes, connections);
  }, [nodes, connections, debouncedSaveFlow]);
  
  const handleEditChange = useCallback((text) => {
    if (editNode) {
      setEditNode({ ...editNode, text });
    }
  }, [editNode]);

  const saveEditedNode = useCallback(() => {
    if (editNode) {
      const updatedNodes = nodes.map(n => n.id === editNode.id ? editNode : n);
      setNodes(updatedNodes);
      debouncedSaveFlow(updatedNodes, connections);
    }
    setEditNode(null);
    setIsModalVisible(false);
  }, [editNode, nodes, connections, debouncedSaveFlow]);
  
  const handleConnectStart = useCallback((nodeId) => {
    setNewConnectionSource(nodeId);
  }, []);
  
  const handleConnectEnd = useCallback((targetId) => {
    if (newConnectionSource && newConnectionSource !== targetId) {
      const newConnection = { sourceId: newConnectionSource, targetId: targetId };
      const exists = connections.some(
        (conn) => conn.sourceId === newConnection.sourceId && conn.targetId === newConnection.targetId
      );
      if (!exists) {
        const updatedConnections = [...connections, newConnection];
        setConnections(updatedConnections);
        debouncedSaveFlow(nodes, updatedConnections);
      }
    }
    setNewConnectionSource(null);
  }, [newConnectionSource, connections, nodes, debouncedSaveFlow]);
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      // Find which node was touched
      const touchedNode = nodes.find(
        (node) =>
          gestureState.x0 >= node.x &&
          gestureState.x0 <= node.x + 150 &&
          gestureState.y0 >= node.y &&
          gestureState.y0 <= node.y + 50
      );
      if (touchedNode) {
        // Handle connections
        const touchX = gestureState.x0 - touchedNode.x;
        const touchY = gestureState.y0 - touchedNode.y;
        if (touchX > 130 && touchY > 15 && touchY < 35) { // Check if touch is on the right-hand connection point
          handleConnectStart(touchedNode.id);
          return;
        }
        
        // Handle dragging
        this.selectedNodeId = touchedNode.id;
        this.initialX = touchedNode.x;
        this.initialY = touchedNode.y;
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      if (this.selectedNodeId) {
        const updatedNodes = nodes.map((node) =>
          node.id === this.selectedNodeId
            ? { ...node, x: this.initialX + gestureState.dx, y: this.initialY + gestureState.dy }
            : node
        );
        setNodes(updatedNodes);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (this.selectedNodeId) {
        // Find which node was released on to create a connection
        const releaseX = this.initialX + gestureState.dx;
        const releaseY = this.initialY + gestureState.dy;

        const targetNode = nodes.find(
          (node) =>
            node.id !== this.selectedNodeId &&
            releaseX > node.x &&
            releaseX < node.x + 150 &&
            releaseY > node.y &&
            releaseY < node.y + 50
        );

        if (newConnectionSource && targetNode) {
          handleConnectEnd(targetNode.id);
        }
        
        if (this.selectedNodeId) {
          debouncedSaveFlow(nodes, connections);
        }
        this.selectedNodeId = null;
      }
      setNewConnectionSource(null);
    },
  });

  const renderConnection = (connection) => {
    const sourceNode = nodes.find((node) => node.id === connection.sourceId);
    const targetNode = nodes.find((node) => node.id === connection.targetId);

    if (!sourceNode || !targetNode) return null;

    const x1 = sourceNode.x + 150; // Node width
    const y1 = sourceNode.y + 25;  // Node height / 2
    const x2 = targetNode.x;
    const y2 = targetNode.y + 25;  // Node height / 2

    return (
      <Line
        key={`${connection.sourceId}-${connection.targetId}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeDasharray="4, 4"
      />
    );
  };
  
  const renderNode = (node) => {
    return (
      <TouchableOpacity
        key={node.id}
        style={[styles.node, { left: node.x, top: node.y }]}
        onLongPress={() => {
          setEditNode(node);
          setIsModalVisible(true);
        }}
        {...panResponder.panHandlers}
      >
        <Text style={styles.nodeText}>{node.text}</Text>
        <TouchableOpacity
          style={styles.connectionPoint}
          onPress={() => handleConnectStart(node.id)}
        />
        {newConnectionSource === node.id && (
          <TouchableOpacity
            style={styles.connectionPointReceiver}
            onPress={() => handleConnectEnd(node.id)}
          />
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.canvasContainer}>
      <Svg height={windowHeight} width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <Marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <Line x1="0" y1="0" x2="10" y2="5" stroke="#FFFFFF" strokeWidth="2" />
          </Marker>
        </Defs>
        {connections.map(renderConnection)}
      </Svg>
      {nodes.map(renderNode)}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={addNode}>
          <Text style={styles.addButtonText}>Add Node</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Edit Node Text</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleEditChange}
              value={editNode?.text || ''}
              placeholder="Enter node text"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={saveEditedNode}
            >
              <Text style={styles.textStyle}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#E0E0E0',
    fontSize: 18,
  },
  errorText: {
    color: '#FF6347',
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  node: {
    position: 'absolute',
    width: 150,
    height: 50,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  nodeText: {
    color: '#E0E0E0',
    fontSize: 14,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectionPoint: {
    position: 'absolute',
    right: -10,
    top: 20,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00FA9A',
  },
  connectionPointReceiver: {
    position: 'absolute',
    left: -10,
    top: 20,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DC143C',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
