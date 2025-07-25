import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.afe2905fd5a5435da22ac74bf2d43266',
  appName: 'NewsGen - AI Content Creator',
  webDir: 'dist',
  server: {
    url: 'https://afe2905f-d5a5-435d-a22a-c74bf2d43266.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;