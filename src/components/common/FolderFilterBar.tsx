import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Folder } from '../../types';
import { useApp } from '../../context/AppContext';
import { Input } from './Input';
import { Button } from './Button';

interface FolderFilterBarProps {
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

export const FolderFilterBar: React.FC<FolderFilterBarProps> = ({
  selectedFolderId,
  onSelectFolder,
}) => {
  const { folders, addFolder, deleteFolder, themeColors } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el nombre de la carpeta');
      return;
    }
    addFolder(newFolderName.trim());
    setNewFolderName('');
    setModalVisible(false);
  };

  const handleLongPressFolder = (folder: Folder) => {
    Alert.alert(
      'Eliminar Carpeta',
      `¿Deseas eliminar la carpeta "${folder.name}"? Los cursos que contiene no se eliminarán, solo se desvincularán de esta carpeta.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            if (selectedFolderId === folder.id) {
              onSelectFolder(null);
            }
            deleteFolder(folder.id);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Opción Todas */}
        <TouchableOpacity
          style={[
            styles.folderPill,
            {
              backgroundColor:
                selectedFolderId === null
                  ? themeColors.primary
                  : themeColors.surface,
              borderColor:
                selectedFolderId === null
                  ? themeColors.primaryDark
                  : themeColors.border,
            },
          ]}
          onPress={() => onSelectFolder(null)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.folderText,
              {
                color: selectedFolderId === null ? '#FFFFFF' : themeColors.text,
                fontWeight: selectedFolderId === null ? '700' : '500',
              },
            ]}
          >
            📁 Todas las Carpetas
          </Text>
        </TouchableOpacity>

        {/* Carpetas Creadas */}
        {folders.map((folder) => {
          const isSelected = selectedFolderId === folder.id;
          return (
            <TouchableOpacity
              key={folder.id}
              style={[
                styles.folderPill,
                {
                  backgroundColor: isSelected
                    ? themeColors.primary
                    : themeColors.surface,
                  borderColor: isSelected
                    ? themeColors.primaryDark
                    : themeColors.border,
                },
              ]}
              onPress={() => onSelectFolder(folder.id)}
              onLongPress={() => handleLongPressFolder(folder)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.folderText,
                  {
                    color: isSelected ? '#FFFFFF' : themeColors.text,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                📂 {folder.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Botón Nueva Carpeta */}
        <TouchableOpacity
          style={[
            styles.addFolderPill,
            {
              backgroundColor: themeColors.surfaceVariant,
              borderColor: themeColors.border,
            },
          ]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.addFolderText, { color: themeColors.primary }]}>
            + Nueva Carpeta
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para crear carpeta */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalBox,
              { backgroundColor: themeColors.surface },
            ]}
          >
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>
              📁 Nueva Carpeta
            </Text>
            <Text style={[styles.modalSubtitle, { color: themeColors.textMuted }]}>
              Organiza tus cursos y asignaciones por grupo o nivel.
            </Text>

            <Input
              label="Nombre de la Carpeta"
              placeholder="Ej: DAM 2º Año, Bachillerato A..."
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => {
                  setNewFolderName('');
                  setModalVisible(false);
                }}
                style={styles.modalBtn}
              />
              <Button
                title="Crear Carpeta"
                variant="primary"
                onPress={handleCreateFolder}
                style={styles.modalBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  folderPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  folderText: {
    fontSize: 12,
  },
  addFolderPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addFolderText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
  },
});

