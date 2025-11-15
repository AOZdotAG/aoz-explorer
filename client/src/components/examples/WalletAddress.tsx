import WalletAddress from '../WalletAddress';

export default function WalletAddressExample() {
  return (
    <div className="p-4">
      <WalletAddress 
        address="7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
        explorerUrl="https://solscan.io/account/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
      />
    </div>
  );
}
