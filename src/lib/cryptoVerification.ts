// lib/cryptoVerification.ts
interface VerificationResult {
  success: boolean;
  confirmations?: number;
  error?: string;
}

// Etherscan (Ethereum, Polygon, Base)
export const verifyEthereumTransaction = async (txHash: string, network: string = 'mainnet'): Promise<VerificationResult> => {
  const API_KEY = '46R5TUGH8SW4YC243VREENVST8X9GZETMV';
  let apiUrl = '';

  switch (network) {
    case 'polygon':
      apiUrl = `https://api.polygonscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${API_KEY}`;
      break;
    case 'base':
      apiUrl = `https://api.basescan.org/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${API_KEY}`;
      break;
    default:
      apiUrl = `https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${API_KEY}`;
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === '1' && data.result.status === '1') {
      return { success: true, confirmations: 10 }; // Etherscan returns confirmed status
    }
    return { success: false, error: 'Transaction not confirmed' };
  } catch (error) {
    return { success: false, error: 'API error' };
  }
};

// Blockchain.com (Bitcoin)
export const verifyBitcoinTransaction = async (txHash: string): Promise<VerificationResult> => {
  const API_KEY = 'PPcnYhtJ2VCAFXlkfP90fexKM5DFeTTuvkrjTeiSCsx3ji2phWvz8VL5cunAWxfV1sni86fTjqexyA3w4mIUPJkAlhTinTdSPHQub38SnyfcBk4EwLtHsLXt2iZ5dHxw';
  
  try {
    const response = await fetch(`https://blockchain.info/rawtx/${txHash}?format=json&api_code=${API_KEY}`);
    const data = await response.json();

    if (data.ver && data.confirmations > 0) {
      return { success: true, confirmations: data.confirmations };
    }
    return { success: false, error: 'Transaction not found' };
  } catch (error) {
    return { success: false, error: 'API error' };
  }
};

// Solana
export const verifySolanaTransaction = async (txHash: string): Promise<VerificationResult> => {
  const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NTgwOTkwMDg3MzMsImVtYWlsIjoicXVpY2tib29zdGJ1c2luZXNzQGdtYWlsLmNvbSIsImFjdGlvbiI6InRva2VuLWFwaSIsImFwaVZlcnNpb24iOiJ2MiIsImlhdCI6MTc1ODA5OTAwOH0.xZSb0G0rrYv0ZdPx75n35zdT0JgjHCmUluSzGjbVqBM';

  try {
    const response = await fetch('https://api.solana.io/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignatureStatuses',
        params: [[txHash], { searchTransactionHistory: true }]
      })
    });

    const data = await response.json();
    
    if (data.result && data.result.value[0] && data.result.value[0].confirmationStatus === 'confirmed') {
      return { success: true, confirmations: 10 };
    }
    return { success: false, error: 'Transaction not confirmed' };
  } catch (error) {
    return { success: false, error: 'API error' };
  }
};

// Main verification function
export const verifyCryptoPayment = async (txHash: string, cryptoType: string): Promise<VerificationResult> => {
  switch (cryptoType.toLowerCase()) {
    case 'bitcoin':
      return await verifyBitcoinTransaction(txHash);
    case 'ethereum':
      return await verifyEthereumTransaction(txHash);
    case 'polygon':
      return await verifyEthereumTransaction(txHash, 'polygon');
    case 'base':
      return await verifyEthereumTransaction(txHash, 'base');
    case 'solana':
      return await verifySolanaTransaction(txHash);
    default:
      return { success: false, error: 'Unsupported cryptocurrency' };
  }
};
