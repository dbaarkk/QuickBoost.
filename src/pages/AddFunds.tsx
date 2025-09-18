import React, { useState, useEffect } from "react";
import { Copy, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Deposit {
  id: string;
  method: string;
  amount: number;
  status: "pending" | "successful" | "rejected";
  created_at: string;
}

const AddFunds: React.FC = () => {
  const [method, setMethod] = useState<"upi" | "crypto">("upi");
  const [amount, setAmount] = useState<number>(0);
  const [utr, setUtr] = useState("");
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Fetch recent deposits
  useEffect(() => {
    const fetchDeposits = async () => {
      const { data, error } = await supabase
        .from("deposits")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDeposits(data as Deposit[]);
      }
    };
    fetchDeposits();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleVerify = async () => {
    if (method === "upi" && !utr) {
      alert("Please enter UTR number after payment.");
      return;
    }
    if (amount <= 0) {
      alert("Please select an amount.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("deposits").insert([
      {
        method,
        amount,
        status: "pending",
        utr: method === "upi" ? utr : null,
        created_at: new Date().toISOString(),
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error submitting deposit.");
    } else {
      alert(
        method === "upi"
          ? "Transaction is being manually verified. Funds will be added soon."
          : "Crypto deposit request submitted."
      );
      setUtr("");
      setAmount(0);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Add Funds</h1>

      {/* Payment Method Toggle */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setMethod("upi")}
          className={`px-4 py-2 rounded-xl ${
            method === "upi" ? "bg-[#00CFFF]" : "bg-gray-700"
          }`}
        >
          UPI
        </button>
        <button
          onClick={() => setMethod("crypto")}
          className={`px-4 py-2 rounded-xl ${
            method === "crypto" ? "bg-[#00CFFF]" : "bg-gray-700"
          }`}
        >
          Cryptocurrency
        </button>
      </div>

      {/* Amount Selector */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Select Amount</label>
        <div className="flex flex-wrap gap-3">
          {(method === "upi"
            ? [100, 200, 500, 1000, 2000]
            : [10, 50, 100, 200, 500, 1000]
          ).map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className={`px-4 py-2 rounded-lg ${
                amount === amt ? "bg-[#00CFFF]" : "bg-gray-700"
              }`}
            >
              {method === "upi" ? `₹${amt}` : `$${amt}`}
            </button>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {method === "crypto" && (
        <div className="mb-6 flex items-center text-yellow-400">
          <AlertCircle className="mr-2" /> Minimum deposit is $1
        </div>
      )}

      {/* UPI Section */}
      {method === "upi" && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Pay via UPI</h2>
          <img
            src="/IMG_20250906_102052.jpg"
            alt="UPI QR Code"
            className="w-48 mb-4"
          />
          <div className="flex items-center space-x-2">
            <span className="font-bold">UPI ID:</span>
            <span className="bg-gray-800 px-3 py-1 rounded">{`aaryaveer@upi`}</span>
            <button
              onClick={() => handleCopy("aaryaveer@upi")}
              className="ml-2 text-[#00CFFF] hover:underline"
            >
              <Copy size={18} />
            </button>
            {copySuccess && (
              <span className="text-green-400 ml-2">Copied!</span>
            )}
          </div>
          <div className="mt-4">
            <label className="block text-sm mb-2">Enter UTR Number</label>
            <input
              type="text"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              placeholder="Enter UTR after payment"
            />
          </div>
        </div>
      )}

      {/* Crypto Section */}
      {method === "crypto" && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Pay via Cryptocurrency</h2>
          <p className="text-gray-400 mb-2">Copy one of the wallet addresses:</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold">BTC:</span>
              <span className="bg-gray-800 px-3 py-1 rounded">
                1A2b3C4d5E6f7G8h9I0j
              </span>
              <button
                onClick={() => handleCopy("1A2b3C4d5E6f7G8h9I0j")}
                className="ml-2 text-[#00CFFF] hover:underline"
              >
                <Copy size={18} />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">ETH:</span>
              <span className="bg-gray-800 px-3 py-1 rounded">
                0xAbCdEfGhIjKlMnOpQrSt
              </span>
              <button
                onClick={() => handleCopy("0xAbCdEfGhIjKlMnOpQrSt")}
                className="ml-2 text-[#00CFFF] hover:underline"
              >
                <Copy size={18} />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">USDT:</span>
              <span className="bg-gray-800 px-3 py-1 rounded">
                T12345abcdef67890
              </span>
              <button
                onClick={() => handleCopy("T12345abcdef67890")}
                className="ml-2 text-[#00CFFF] hover:underline"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full py-3 bg-[#00CFFF] text-white rounded-lg font-bold hover:bg-[#0AC5FF] transition disabled:opacity-50"
      >
        {loading ? "Processing..." : "Verify Payment"}
      </button>

      {/* Recent Deposits */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Recent Deposits</h2>
        <div className="space-y-3">
          {deposits.map((dep) => (
            <div
              key={dep.id}
              className="p-3 rounded-lg bg-gray-800 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {dep.method.toUpperCase()} - {dep.amount}{" "}
                  {dep.method === "upi" ? "INR" : "USD"}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(dep.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                {dep.status === "pending" && (
                  <span className="text-orange-400 flex items-center">
                    <AlertCircle className="mr-1" size={16} /> Pending
                  </span>
                )}
                {dep.status === "successful" && (
                  <span className="text-green-400 flex items-center">
                    <CheckCircle className="mr-1" size={16} /> Successful
                  </span>
                )}
                {dep.status === "rejected" && (
                  <span className="text-red-400 flex items-center">
                    <XCircle className="mr-1" size={16} /> Rejected
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddFunds;
