"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type Props = {
    amount: number;
    onSuccess: (details: any) => void;
    onError?: (error: any) => void;
};


export default function PayPalOneTimeButton({ amount, onSuccess, onError }: Props) {
    const [ready, setReady] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const containerId = "paypal-button-container-P-1BU036838K3528252NGLD27Q";

    useEffect(() => {
        if (!ready || !containerRef.current || !(window as any).paypal) return;

        const buttons = (window as any).paypal.Buttons({
            style: {
                shape: "rect",
                color: "gold",
                layout: "vertical",
                label: "subscribe",
            },
            createSubscription: (_data: any, actions: any) => {
                return actions.subscription.create({
                    plan_id: "P-1BU036838K3528252NGLD27Q",
                });
            },
            onApprove: async (data: any) => {
                alert(data.subscriptionID);
                onSuccess({ id: data.subscriptionID });
            },
            onError: (err: any) => {
                console.error("PayPal Error:", err);
                if (onError) onError(err);
            },
        });

        buttons.render(`#${containerId}`);

        return () => {
            buttons.close?.();
            if (containerRef.current) containerRef.current.innerHTML = "";
        };
    }, [ready, amount, onSuccess, onError, containerId]);

    return (
        <>
            <Script
                src="https://www.paypal.com/sdk/js?client-id=AU1V0qOiwlrGbz1ht2OI_UIpFLYC6Iv8-35UM0aHjkOxn3yY4YkXGMAviv79wrOmy62dgP6BiAX26HH6&vault=true&intent=subscription"
                data-sdk-integration-source="button-factory"
                onLoad={() => setReady(true)}
            />
            <div id={containerId} ref={containerRef} className="z-0 relative" />
        </>
    );
}
