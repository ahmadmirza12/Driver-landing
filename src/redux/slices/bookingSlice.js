import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  serviceType: 'Airport Transfer',
  vehicleType: 'Sedan',
  vehicleBrand: 'Select',
  addOnService: 'None',
  pickupLocation: '',
  dropoffLocation: '',
  pickupDateTime: 'Today',
  flightNumber: '',
  fullName: '',
  email: ''
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    updateBookingForm: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetBookingForm: () => initialState,
  },
});

export const { updateBookingForm, resetBookingForm } = bookingSlice.actions;
export default bookingSlice.reducer;
