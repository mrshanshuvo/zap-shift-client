import React from 'react';
import useAxiosSecure from './useAxiosSecure';

const useTrackingLogger = () => {
  const axiosSecure = useAxiosSecure();
  const logTracking = async ({ trackingId, status, details, location, updated_by }) => {
    try {
      const payload = {
        trackingId,
        status,
        details,
        location,
        updated_by
      };
      await axiosSecure.post('/trackings', payload);
    } catch (error) {
      console.error('Error logging tracking update:', error);
    }
  };

  return { logTracking };
};

export default useTrackingLogger;