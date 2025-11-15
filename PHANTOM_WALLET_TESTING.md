# Phantom Wallet Integration - Testing Guide

## ✅ Automated Test Results

The following features have been verified through automated testing:
- ✓ Homepage loads correctly
- ✓ "Connect Phantom" button is visible when wallet not connected
- ✓ "Create Agent" navigation link is hidden when wallet not connected
- ✓ /create-agent page redirects to "Wallet Not Connected" screen
- ✓ Form structure and all fields are present

## 🧪 Manual Testing Required

Since Phantom wallet connection requires the actual browser extension, please test the following manually:

### 1. Install Phantom Wallet
1. Install Phantom extension from https://phantom.app/
2. Create or import a Solana wallet
3. Make sure you're on Solana mainnet or devnet

### 2. Test Wallet Connection
1. Open the application
2. Click "Connect Phantom" button in the header
3. Approve the connection in the Phantom popup
4. **Expected Result:**
   - Button changes to show truncated wallet address (e.g., "7xKX...gAsU")
   - Disconnect button (logout icon) appears
   - "Create Agent" link appears in the header

### 3. Test Wallet Disconnection
1. Click the disconnect button (logout icon)
2. **Expected Result:**
   - Header returns to "Connect Phantom" button
   - "Create Agent" link disappears
   - If on /create-agent page, should show "Wallet Not Connected" screen

### 4. Test Create Agent Form (Connected Wallet)
1. Connect your Phantom wallet
2. Click "Create Agent" in the header
3. Try submitting the empty form
4. **Expected Result:** All 6 fields show validation errors

### 5. Test Form Validation
Fill in fields one by one and verify errors disappear:

**Agent Name:**
- ✓ Test with empty string → "Agent name is required"
- ✓ Test with "A" → should accept (min 1 char)
- ✓ Test with 101+ characters → "Agent name must be less than 100 characters"

**Agent Type:**
- ✓ Leave unselected → "Please select an agent type"
- ✓ Select any type → error disappears

**Description:**
- ✓ Test with "Short" → "Description must be at least 10 characters"
- ✓ Test with 10+ characters → error disappears
- ✓ Test with 501+ characters → "Description must be less than 500 characters"

**Settlement Address:**
- ✓ Test with "ABC" → "Invalid Solana address"
- ✓ Test with valid Solana address (32-44 chars) → error disappears
- Example: `DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CSKBF`

**aozOath Description:**
- ✓ Test with "Short" → "Oath description must be at least 10 characters"
- ✓ Test with 10+ characters → error disappears

**Required Fulfillment:**
- ✓ Test with "Short" → "Fulfillment description must be at least 10 characters"
- ✓ Test with 10+ characters → error disappears

### 6. Test Successful Submission
1. Fill in all fields with valid data:
   ```
   Agent Name: aozAgentDealer
   Agent Type: LOAN
   Description: An autonomous AI agent that manages loan agreements on Solana
   Settlement Address: DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CSKBF
   aozOath: I promise to manage all loan agreements fairly and settle on time
   Required Fulfillment: Borrower must deposit collateral to the specified address
   ```
2. Click "Create Agent"
3. **Expected Result:**
   - Button shows "Creating Agent..." with spinner
   - Button is disabled
   - Success toast appears: "Agent Created Successfully! 🎉"
   - Form resets or redirects to home
   - After 1.5 seconds, automatically navigates to homepage

### 7. Test Navigation
1. Connect wallet
2. Click "Create Agent" → should navigate to /create-agent
3. Click "Home" → should navigate to /
4. Click "Cancel" on create form → should navigate to /
5. Verify navigation works with and without wallet connected

### 8. Test Wallet Persistence
1. Connect Phantom wallet
2. Refresh the page
3. **Expected Result:** 
   - Wallet remains connected
   - Header shows wallet address
   - "Create Agent" link remains visible

### 9. Test Account Switching
1. Connect Phantom wallet
2. Switch accounts in Phantom extension
3. **Expected Result:**
   - Header updates to show new wallet address
   - App remains in connected state

## 🐛 Known Limitations

1. **Blockchain Integration Not Implemented Yet:**
   - Form submission currently shows a success message but doesn't actually create an agent on Solana
   - This is marked with `TODO: Implement actual agent creation on Solana blockchain`
   - Backend integration will be needed to mint actual NFTs

2. **No Phantom Installed Handler:**
   - If user doesn't have Phantom installed and clicks "Connect Phantom"
   - Currently opens Phantom website in new tab (expected behavior)

## 📝 Test Results Template

Copy and fill in after manual testing:

```
✅ Wallet Connection: [ ] Pass [ ] Fail
✅ Wallet Disconnection: [ ] Pass [ ] Fail
✅ Form Validation: [ ] Pass [ ] Fail
✅ Form Submission: [ ] Pass [ ] Fail
✅ Navigation: [ ] Pass [ ] Fail
✅ Wallet Persistence: [ ] Pass [ ] Fail
✅ Account Switching: [ ] Pass [ ] Fail

Issues Found:
1. 
2. 
3. 

Notes:
```

## 🚀 Next Steps

Once manual testing confirms everything works:
1. Implement actual Solana blockchain integration for agent creation
2. Add backend API endpoints to store agent data
3. Connect to Solana program for NFT minting
4. Add transaction signing for on-chain operations
