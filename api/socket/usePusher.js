import Pusher from "pusher-js";
import { useEffect } from "react";

export default function usePusher({ channelName, eventName, onEvent }) {
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
      enabledTransports: ["ws"],
      forceTLS: false,
      wsHost: process.env.NEXT_PUBLIC_PUSHER_WS_HOST,
      wsPort: Number(process.env.NEXT_PUBLIC_PUSHER_WS_PORT),
    });

    const channel = pusher.subscribe(channelName);

    const handler = (data) => {
      onEvent?.(data);
    };

    channel.bind(eventName, handler);

    return () => {
      channel.unbind(eventName, handler);
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [channelName, eventName, onEvent]);
}
