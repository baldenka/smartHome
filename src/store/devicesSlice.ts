import { createSlice } from '@reduxjs/toolkit';
import { Device } from '../types';

interface DevicesState {
  devices: Device[];
  loading: boolean;
}

const initialState: DevicesState = {
  devices: [],
  loading: false,
};

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {},
});

export default devicesSlice.reducer;