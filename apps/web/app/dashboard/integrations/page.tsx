"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Link2,
  CheckCircle2,
  ArrowRight,
  Webhook,
} from "lucide-react";

export default function IntegrationsPage() {
  const [shopifyUrl, setShopifyUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [connecting, setConnecting] = useState(false);

  function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setConnecting(true);
    // Simulated connection
    setTimeout(() => setConnecting(false), 1500);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-500 mt-1">
          Connect external platforms to sync customer data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected store */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <ShoppingBag size={20} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Shopify
              </h2>
              <p className="text-xs text-gray-500">E-commerce integration</p>
            </div>
          </div>

          {/* Mock connected store */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">
                Connected
              </span>
            </div>
            <div className="text-sm text-gray-700 font-medium">
              Tokyo Lifestyle Store
            </div>
            <div className="text-xs text-gray-500 font-mono mt-0.5">
              tokyo-lifestyle.myshopify.com
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span>Last sync: 2 min ago</span>
              <span>•</span>
              <span>1,247 products</span>
              <span>•</span>
              <span>3,891 orders synced</span>
            </div>
          </div>

          {/* Webhook subscriptions */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Webhook size={14} />
              Active Webhooks
            </h3>
            <div className="space-y-1.5">
              {[
                "orders/create",
                "orders/fulfilled",
                "customers/create",
                "customers/update",
                "products/update",
              ].map((hook) => (
                <div
                  key={hook}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <code className="text-xs font-mono">{hook}</code>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Customer events from Shopify are automatically linked to LINE user
            profiles when a matching email is found.
          </p>
        </div>

        {/* Connect new store */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Connect Another Store
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Enter your Shopify store details to start syncing.
          </p>

          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Store URL
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={shopifyUrl}
                  onChange={(e) => setShopifyUrl(e.target.value)}
                  placeholder="my-store"
                  className="flex-1 rounded-l-lg border border-r-0 border-gray-300 px-3.5 py-2.5 text-sm focus:border-line-green focus:outline-none focus:ring-2 focus:ring-line-green/20"
                />
                <span className="inline-flex items-center rounded-r-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                  .myshopify.com
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Admin API Access Token
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="shpat_xxxxxxxxxxxxx"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-line-green focus:outline-none focus:ring-2 focus:ring-line-green/20"
              />
              <p className="mt-1.5 text-xs text-gray-400">
                Generate this in your Shopify Admin → Settings → Apps → Develop
                apps
              </p>
            </div>

            <button
              type="submit"
              disabled={connecting || !shopifyUrl}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-line-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-line-green-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {connecting ? (
                "Connecting..."
              ) : (
                <>
                  Connect Store <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              How it works
            </h3>
            <ol className="space-y-2 text-sm text-gray-500">
              <li className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-gray-600">
                  1
                </span>
                Connect your Shopify store with an API key
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-gray-600">
                  2
                </span>
                We register webhooks for order and customer events
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-gray-600">
                  3
                </span>
                Customer data is matched with LINE user profiles
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
