import { Typography } from '@/constants/tyopography';
import { Picker } from '@react-native-picker/picker';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type MonthPickerProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: dayjs.Dayjs) => void;
};

const years = Array.from({ length: 10 }, (_, i) => dayjs().year() - 5 + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

export default function MonthPicker({
  visible,
  onClose,
  onSelect,
}: MonthPickerProps) {
  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState(dayjs().month() + 1);

  const handleConfirm = () => {
    const selected = dayjs(`${year}-${month}-01`);
    onSelect(selected);
    onClose();
  };
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.confirmText}>확인</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerBox}>
            <Picker
              selectedValue={year}
              onValueChange={setYear}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {years.map((y) => (
                <Picker.Item key={y} label={`${y}년`} value={y} />
              ))}
            </Picker>

            <Picker
              selectedValue={month}
              onValueChange={setMonth}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {months.map((m) => (
                <Picker.Item key={m} label={`${m}월`} value={m} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    height: 250,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelText: {
    ...Typography.subtitle3,
    color: '#B3B3B3',
  },
  confirmText: {
    ...Typography.subtitle3,
    color: '#fff',
  },
  pickerBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    bottom: 50,
  },
  picker: {
    width: '45%',
  },
  pickerItem: {
    ...Typography.subtitle1,
    color: '#7C7C7C',
  },
});
