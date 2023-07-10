# Solidity API

## LayerrMinter

LayerrMinter is an unowned immutable primative for ERC20, ERC721 and ERC1155
        token minting on EVM-based blockchains. Token contract owners build and sign
        MintParameters which are used by minters to create MintOrders to mint tokens.
        MintParameters define what to mint and conditions for minting.
        Conditions for minting include requiring tokens be burned, payment amounts,
        start time, end time, additional oracle signature, maximum supply, max per 
        wallet and max signature use.
        Mint tokens can be ERC20, ERC721 or ERC1155
        Burn tokens can be ERC20, ERC721 or ERC1155
        Payment tokens can be the chain native token or ERC20
        Payment tokens can specify a referral BPS to pay a referral fee at time of mint
        LayerrMinter has native support for delegate.cash delegation on allowlist mints

### signatureInvalid

```solidity
mapping(address => mapping(bytes32 => bool)) signatureInvalid
```

_mapping of signature digests that have been marked as invalid for a token contract_

### signatureUseCount

```solidity
mapping(bytes32 => uint256) signatureUseCount
```

_counter for number of times a signature has been used, only incremented if signatureMaxUses > 0_

### contractAllowedSigner

```solidity
mapping(address => mapping(address => bool)) contractAllowedSigner
```

_mapping of addresses that are allowed signers for token contracts_

### contractAllowedOracle

```solidity
mapping(address => mapping(address => bool)) contractAllowedOracle
```

_mapping of addresses that are allowed oracle signers for token contracts_

### signerNonce

```solidity
mapping(address => uint256) signerNonce
```

_mapping of nonces for signers, used to invalidate all previously signed MintParameters_

### delegateCash

```solidity
contract IDelegationRegistry delegateCash
```

_delegate.cash registry for users that want to use a hot wallet for minting an allowlist mint_

### setContractAllowedSigner

```solidity
function setContractAllowedSigner(address _signer, bool _allowed) external
```

This function is called by token contracts to update allowed signers for minting

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _signer | address | address of the EIP712 signer |
| _allowed | bool | if the `_signer` is allowed to sign for minting |

### setContractAllowedOracle

```solidity
function setContractAllowedOracle(address _oracle, bool _allowed) external
```

This function is called by token contracts to update allowed oracles for offchain authorizations

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _oracle | address | address of the oracle |
| _allowed | bool | if the `_oracle` is allowed to sign offchain authorizations |

### incrementSignerNonce

```solidity
function incrementSignerNonce() external
```

Increments the nonce for a signer to invalidate all previous signed MintParameters

### incrementNonceFor

```solidity
function incrementNonceFor(address signer, bytes signature) external
```

Increments the nonce on behalf of another account by validating a signature from that account

_The signature is an eth personal sign message of the current signer nonce plus the chain id
     ex. current nonce 0 on chain 5 would be a signature of \x19Ethereum Signed Message:\n15
         current nonce 50 on chain 1 would be a signature of \x19Ethereum Signed Message:\n251_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| signer | address | account to increment nonce for |
| signature | bytes | signature proof that the request is coming from the account |

### setSignatureValidity

```solidity
function setSignatureValidity(bytes32[] signatureDigests, bool invalid) external
```

This function is called by token contracts to update validity of signatures for the LayerrMinter contract

_`invalid` should be true to invalidate signatures, the default state of `invalid` being false means 
     a signature is valid for a contract assuming all other conditions are met_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| signatureDigests | bytes32[] |  |
| invalid | bool | if the supplied digests will be marked as valid or invalid |

### mint

```solidity
function mint(struct MintOrder mintOrder) external payable
```

Validates and processes a single MintOrder, tokens are minted to msg.sender

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintOrder | struct MintOrder | struct containing the details of the mint order |

### mintBatch

```solidity
function mintBatch(struct MintOrder[] mintOrders) external payable
```

Validates and processes an array of MintOrders, tokens are minted to msg.sender

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintOrders | struct MintOrder[] | array of structs containing the details of the mint orders |

### mintTo

```solidity
function mintTo(address mintToWallet, struct MintOrder mintOrder, uint256 paymentContext) external payable
```

Validates and processes a single MintOrder, tokens are minted to `mintToWallet`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintToWallet | address | the address tokens will be minted to |
| mintOrder | struct MintOrder | struct containing the details of the mint order |
| paymentContext | uint256 | Contextual information related to the payment process                     (Note: This parameter is required for integration with                      the payment processor and does not impact the behavior                      of the function) |

### mintBatchTo

```solidity
function mintBatchTo(address mintToWallet, struct MintOrder[] mintOrders, uint256 paymentContext) external payable
```

Validates and processes an array of MintOrders, tokens are minted to `mintToWallet`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintToWallet | address | the address tokens will be minted to |
| mintOrders | struct MintOrder[] | array of structs containing the details of the mint orders |
| paymentContext | uint256 | Contextual information related to the payment process                     (Note: This parameter is required for integration with                      the payment processor and does not impact the behavior                      of the function) |

### _processMintOrder

```solidity
function _processMintOrder(address mintToWallet, struct MintOrder mintOrder, uint256 suppliedBurnTokenIdIndex) internal returns (uint256)
```

Validates mint parameters, processes payments and burns, mint tokens

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintToWallet | address | address that tokens will be minted to |
| mintOrder | struct MintOrder | struct containing the mint order details |
| suppliedBurnTokenIdIndex | uint256 | the current burn token index before processing the mint order |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | suppliedBurnTokenIdIndex the current burn token index after processing the mint order |

### _validateMintParameters

```solidity
function _validateMintParameters(address mintToWallet, struct MintOrder mintOrder, bytes mintParametersSignature, address mintParametersSigner, bytes32 mintParametersDigest) internal returns (bool useDelegate, address oracleSigner)
```

Checks the MintParameters for start/end time compliance, signer nonce, allowlist, signature max uses and oracle signature

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintToWallet | address | address tokens will be minted to |
| mintOrder | struct MintOrder | struct containing the mint order details |
| mintParametersSignature | bytes | EIP712 signature of the MintParameters |
| mintParametersSigner | address | recovered signer of the mintParametersSignature |
| mintParametersDigest | bytes32 | hash digest of the MintParameters |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| useDelegate | bool | true for allowlist mint that mintToWallet |
| oracleSigner | address | recovered address of the oracle signer if oracle signature is required or address(0) if oracle signature is not required |

### _processPayments

```solidity
function _processPayments(uint256 mintOrderQuantity, struct PaymentToken[] paymentTokens, address referrer) internal
```

Iterates over payment tokens and sends payment amounts to recipients. 
        If there is a referrer and a payment token has a referralBPS the referral amount is split and sent to the referrer
        Payment token types can be native token or ERC20.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintOrderQuantity | uint256 | multipier for each payment token |
| paymentTokens | struct PaymentToken[] | array of payment tokens for a mint order |
| referrer | address | wallet address of user that made the referral for this sale |

### _processBurns

```solidity
function _processBurns(uint256 mintOrderQuantity, uint256 suppliedBurnTokenIdIndex, struct BurnToken[] burnTokens, uint256[] suppliedBurnTokenIds) internal returns (uint256)
```

Processes burns for a mint order. Burn tokens can be ERC20, ERC721, or ERC1155. Burn types can be
        contract burns or send to dead address.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintOrderQuantity | uint256 | multiplier for each burn token |
| suppliedBurnTokenIdIndex | uint256 | current index for the supplied burn token ids before processing burns |
| burnTokens | struct BurnToken[] | array of burn tokens for a mint order |
| suppliedBurnTokenIds | uint256[] | array of burn token ids supplied by minter |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | suppliedBurnTokenIdIndex current index for the supplied burn token ids after processing burns |

### _processMints

```solidity
function _processMints(struct MintToken[] mintTokens, address mintParametersSigner, bytes32 mintParametersDigest, address oracleSigner, uint256 mintOrderQuantity, address mintCountWallet, address mintToWallet) internal
```

Processes mints for a mint order. Token types can be ERC20, ERC721, or ERC1155.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintTokens | struct MintToken[] | array of mint tokens from the mint order |
| mintParametersSigner | address | recovered address from the mint parameters signature |
| mintParametersDigest | bytes32 | hash digest of the supplied mint parameters |
| oracleSigner | address | recovered address of the oracle signer if oracle signature required was true, address(0) otherwise |
| mintOrderQuantity | uint256 | multiplier for each mint token |
| mintCountWallet | address | wallet address that will be used for checking max per wallet mint conditions |
| mintToWallet | address | wallet address that tokens will be minted to |

### _checkContractSigners

```solidity
function _checkContractSigners(address contractAddress, address mintParametersSigner, bytes32 mintParametersDigest, address oracleSigner) internal view
```

Checks the mint parameters and oracle signers to ensure they are authorized for the token contract.
        Checks that the mint parameters signature digest has not been marked as invalid.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | token contract to check signers for |
| mintParametersSigner | address | recovered signer for the mint parameters |
| mintParametersDigest | bytes32 | hash digest of the supplied mint parameters |
| oracleSigner | address | recovered oracle signer if oracle signature is required by mint parameters |

### _checkERC1155MintQuantities

```solidity
function _checkERC1155MintQuantities(address contractAddress, uint256 tokenId, uint256 maxSupply, uint256 maxMintPerWallet, address mintCountWallet, uint256 mintAmount) internal view
```

Calls the token contract to get total minted and minted by wallet, checks against mint parameters max supply and max per wallet

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | token contract to check mint counts for |
| tokenId | uint256 | id of the token to check |
| maxSupply | uint256 | maximum supply for a token defined in mint parameters |
| maxMintPerWallet | uint256 | maximum per wallet for a token defined in mint parameters |
| mintCountWallet | address | wallet to check for minted amount |
| mintAmount | uint256 | the amount that will be minted |

### _checkERC721MintQuantities

```solidity
function _checkERC721MintQuantities(address contractAddress, uint256 maxSupply, uint256 maxMintPerWallet, address mintCountWallet, uint256 mintAmount) internal view
```

Calls the token contract to get total minted and minted by wallet, checks against mint parameters max supply and max per wallet

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | token contract to check mint counts for |
| maxSupply | uint256 | maximum supply for a token defined in mint parameters |
| maxMintPerWallet | uint256 | maximum per wallet for a token defined in mint parameters |
| mintCountWallet | address | wallet to check for minted amount |
| mintAmount | uint256 | the amount that will be minted |

### _checkERC20MintQuantities

```solidity
function _checkERC20MintQuantities(address contractAddress, uint256 maxSupply, uint256 maxMintPerWallet, address mintCountWallet, uint256 mintAmount) internal view
```

Calls the token contract to get total minted and minted by wallet, checks against mint parameters max supply and max per wallet

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | token contract to check mint counts for |
| maxSupply | uint256 | maximum supply for a token defined in mint parameters |
| maxMintPerWallet | uint256 | maximum per wallet for a token defined in mint parameters |
| mintCountWallet | address | wallet to check for minted amount |
| mintAmount | uint256 | the amount that will be minted |

### _transferNative

```solidity
function _transferNative(address to, uint256 amount) internal
```

Transfers `amount` of native token to `to` address. Reverts if the transfer fails.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | address to send native token to |
| amount | uint256 | amount of native token to send |

### _transferERC20

```solidity
function _transferERC20(address contractAddress, address from, address to, uint256 amount) internal
```

Transfers `amount` of ERC20 token from `from` address to `to` address.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | ERC20 token address |
| from | address | address to transfer ERC20 tokens from |
| to | address | address to send ERC20 tokens to |
| amount | uint256 | amount of ERC20 tokens to send |

## LayerrProxy

A proxy contract that serves as an interface for interacting with 
        Layerr tokens. At deployment it sets token properties and contract 
        ownership, initializes signers and mint extensions, and configures 
        royalties.

### proxy

```solidity
address proxy
```

_the implementation address for the proxy contract_

### DeploymentFailed

```solidity
error DeploymentFailed()
```

_Thrown when a required initialization call fails_

### constructor

```solidity
constructor(address _proxy, string _name, string _symbol, uint96 royaltyPct, address royaltyReceiver, address operatorFilterRegistry, address _extension, address _renderer, address[] _signers) public
```

Initializes the proxy contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _proxy | address | implementation address for the proxy contract |
| _name | string | token contract name |
| _symbol | string | token contract symbol |
| royaltyPct | uint96 | default royalty percentage in BPS |
| royaltyReceiver | address | default royalty receiver |
| operatorFilterRegistry | address | address of the operator filter registry to subscribe to |
| _extension | address | minting extension to use with the token contract |
| _renderer | address | renderer to use with the token contract |
| _signers | address[] | array of allowed signers for the mint extension |

### fallback

```solidity
fallback() external payable
```

## LayerrRenderer

LayerrRenderer handles contractURI and tokenURI generation for contracts
        deployed on the Layerr platform. Contract owners have complete control of 
        their tokens with the ability to set their own renderer, host their tokens
        with Layerr, set all tokens to a prereveal image, or set a base URI that
        token ids will be appended to.
        Tokens hosted with Layerr will automatically generate a tokenURI with the
        `layerrBaseTokenUri`/{chainId}/{contractAddress}/{tokenId} to allow new tokens
        to be minted without updating a base uri.
        For long term storage, Layerr-hosted tokens can be swept onto Layerr's IPFS
        solution.

### owner

```solidity
address owner
```

_Layerr-owned EOA that is allowed to update the base token and base contract URIs for Layerr-hosted non-IPFS tokens_

### layerrSigner

```solidity
address layerrSigner
```

_Layerr's signature account for checking parameters of tokens swept to Layerr IPFS_

### layerrBaseTokenUri

```solidity
string layerrBaseTokenUri
```

_The base token URI that chainId, contractAddress and tokenId are added to for rendering_

### layerrBaseContractUri

```solidity
string layerrBaseContractUri
```

_The base contract URI that chainId and contractAddress are added to for rendering_

### contractRenderType

```solidity
mapping(address => enum ILayerrRenderer.RenderType) contractRenderType
```

_The rendering type for a token contract, defaults to LAYERR_HOSTED_

### contractBaseTokenUri

```solidity
mapping(address => string) contractBaseTokenUri
```

_Base token URI set by the token contract owner for BASE_PLUS_TOKEN render type and LAYERR_HOSTED tokens on IPFS_

### contractContractUri

```solidity
mapping(address => string) contractContractUri
```

_Token contract URI set by the token contract owner_

### layerrHostedAllTokensOnIPFS

```solidity
mapping(address => bool) layerrHostedAllTokensOnIPFS
```

_mapping of token contract addresses that flag a token contract as having all of its tokens hosted on Layerr IPFS_

### layerrHostedTokensOnIPFS

```solidity
mapping(address => mapping(uint256 => uint256)) layerrHostedTokensOnIPFS
```

_bitmap of token ids for a token contract that have been moved to Layerr hosted IPFS_

### layerrHostedIPFSExpiration

```solidity
mapping(address => uint256) layerrHostedIPFSExpiration
```

_mapping of token contract addresses with the UTC timestamp of when the IPFS hosting is paid through_

### onlyOwner

```solidity
modifier onlyOwner()
```

### constructor

```solidity
constructor() public
```

### tokenURI

```solidity
function tokenURI(address contractAddress, uint256 tokenId) external view returns (string _tokenURI)
```

Generates a tokenURI for the `contractAddress` and `tokenId`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | token contract address to render a token URI for |
| tokenId | uint256 | token id to render |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenURI | string | uri for the token metadata |

### contractURI

```solidity
function contractURI(address contractAddress) external view returns (string _contractURI)
```

Generates a contractURI for the `contractAddress`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | contract address to render a contract URI for |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| _contractURI | string | uri for the contract metadata |

### setContractBaseTokenUri

```solidity
function setContractBaseTokenUri(address contractAddress, string baseTokenUri, enum ILayerrRenderer.RenderType renderType) external
```

Updates rendering settings for a contract. Must be the ERC173 owner for the token contract to call.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | address of the contract to set the base token URI for |
| baseTokenUri | string | base token URI to set for `contractAddress` |
| renderType | enum ILayerrRenderer.RenderType | sets the current render type for the contract |

### setContractUri

```solidity
function setContractUri(address contractAddress, string contractUri) external
```

Updates rendering settings for a contract. Must be the ERC173 owner for the token contract to call.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | address of the contract to set the base token URI for |
| contractUri | string | contract URI to set for `contractAddress` |

### setContractBaseTokenUriForLayerrHostedIPFS

```solidity
function setContractBaseTokenUriForLayerrHostedIPFS(address contractAddress, string baseTokenUri, bool allTokens, uint256[] tokenIds, uint256 ipfsExpiration, bytes signature) external payable
```

Updates the base token URI to sweep tokens to IPFS for Layerr hosted tokens
        This allows new tokens to continue to be minted on the contract with the default
        rendering address while existing tokens are moved onto IPFS for long term storage.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | address of the token contract |
| baseTokenUri | string | base token URI to set for the contract's tokens |
| allTokens | bool | set to true for larger collections that are done minting                  avoids setting each token id in the bitmap for gas savings but new tokens                  will not render with the default rendering address |
| tokenIds | uint256[] | array of token ids that are being swept to Layerr hosted IPFS |
| ipfsExpiration | uint256 | UTC timestamp that the IPFS hosting is paid through |
| signature | bytes | signature by Layerr account to confirm the parameters supplied |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

### setLayerrSigner

```solidity
function setLayerrSigner(address _layerrSigner) external
```

Owner function to set the Layerr signature account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _layerrSigner | address | address that will be used to check signatures |

### setLayerrBaseTokenUri

```solidity
function setLayerrBaseTokenUri(string _layerrBaseTokenUri) external
```

Owner function to set the default token rendering URI

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _layerrBaseTokenUri | string | base token uri to be used for default token rendering |

### setLayerrBaseContractUri

```solidity
function setLayerrBaseContractUri(string _layerrBaseContractUri) external
```

Owner function to set the default contract rendering URI

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _layerrBaseContractUri | string | base contract uri to be used for default rendering |

### _isLayerrHostedIPFS

```solidity
function _isLayerrHostedIPFS(address contractAddress, uint256 tokenId) internal view returns (bool isIPFS)
```

Checks to see if a token has been flagged as being hosted on Layerr IPFS

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | token contract address to check |
| tokenId | uint256 | id of the token to check |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| isIPFS | bool | if token has been flagged as being hosted on Layerr IPFS |

### _setLayerrHostedIPFS

```solidity
function _setLayerrHostedIPFS(address contractAddress, uint256 tokenId) internal
```

Flags a token as being hosted on Layerr IPFS in a bitmap

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | token contract address |
| tokenId | uint256 | id of the token |

### _toString

```solidity
function _toString(uint256 value) internal pure virtual returns (string str)
```

### _toString

```solidity
function _toString(address value) internal pure returns (string)
```

### _char

```solidity
function _char(bytes1 b) internal pure returns (bytes1 c)
```

### _recover

```solidity
function _recover(bytes32 hash, bytes sig) internal pure returns (address)
```

_Recover signer address from a message by using their signature_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| hash | bytes32 | bytes32 message, the hash is the signed message. What is recovered is the signer address. |
| sig | bytes | bytes signature, the signature is generated using web3.eth.sign() |

## LayerrWallet

A multi-sig smart contract wallet with support for
        both transactions that are chain-specific and 
        transactions that are replayable on all chains that
        the contract is deployed on.

### Call

_Defines call parameters for transactions_

```solidity
struct Call {
  uint256 nonce;
  address to;
  uint256 value;
  bytes data;
  uint256 gas;
}
```

### InvalidCaller

```solidity
error InvalidCaller()
```

_Thrown when non-address(this) attempts to call external functions that must be called from address(this)_

### SignaturesOutOfOrder

```solidity
error SignaturesOutOfOrder()
```

_Thrown when signatures are supplied out of order, signatures must be supplied in ascending signer id order_

### AddressAlreadySigner

```solidity
error AddressAlreadySigner()
```

_Thrown when attempting to add a signer that already exists_

### AddressNotSigner

```solidity
error AddressNotSigner()
```

_Thrown when attempting to remove an address that is not currently a signer_

### NotEnoughSigners

```solidity
error NotEnoughSigners()
```

@dev Thrown when remove signer/threshold update would make it impossible to execute a transaction
      or when a transaction is submitted without enough signatures to meet the threshold.

### InvalidNonce

```solidity
error InvalidNonce()
```

_Thrown when the supplied call's nonce is not the current nonce for the contract_

### CannotCallSelf

```solidity
error CannotCallSelf()
```

_Thrown when attempting to call the add/remove signer and threshold functions with a chain-specific call_

### CallFailed

```solidity
error CallFailed()
```

_Thrown when the call results in a revert_

### SignerRemoved

```solidity
event SignerRemoved(address signer)
```

_Emitted when removing a signer_

### SignerAdded

```solidity
event SignerAdded(address signer, uint256 signerId)
```

_Emitted when adding a signer_

### EIP712_DOMAIN_TYPEHASH

```solidity
bytes32 EIP712_DOMAIN_TYPEHASH
```

### CHAINLESS_EIP712_DOMAIN_TYPEHASH

```solidity
bytes32 CHAINLESS_EIP712_DOMAIN_TYPEHASH
```

### CALL_TYPEHASH

```solidity
bytes32 CALL_TYPEHASH
```

### signerIds

```solidity
mapping(address => uint256) signerIds
```

_mapping of signer addresses to their id, addresses with id of 0 are not valid signers_

### minimumSignatures

```solidity
uint32 minimumSignatures
```

_the minimum number of valid signatures to execute a transaction_

### currentSigners

```solidity
uint32 currentSigners
```

_the number of signers that are currently authorized to sign a transaction_

### chainCallNonce

```solidity
uint32 chainCallNonce
```

_the current nonce for transactions that can only be executed on a specific chain_

### chainlessCallNonce

```solidity
uint32 chainlessCallNonce
```

_the current nonce for transactions that can be executed across all chains_

### constructor

```solidity
constructor() public
```

### chainlessCall

```solidity
function chainlessCall(struct LayerrWallet.Call call, bytes[] signatures) external
```

Chainless calls are not chain specific and can be replayed on any chain
        that the contract is deployed to.

_This is intended to be used for protocol updates that need to be applied 
     across all chains._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| call | struct LayerrWallet.Call | struct containing the details of the call transaction to execute |
| signatures | bytes[] | signatures to validate the call |

### chainCall

```solidity
function chainCall(struct LayerrWallet.Call call, bytes[] signatures) external
```

Chain calls are chain specific and cannot be replayed to other chains.

_This is intended to be used for transactions that are chain-specific 
     such as treasury management where values and addresses that values are being
     sent to may differ from chain to chain._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| call | struct LayerrWallet.Call | struct containing the details of the call transaction to execute |
| signatures | bytes[] | signatures to validate the call |

### addSigner

```solidity
function addSigner(address signer) external
```

Adds a signer to the smart contract wallet

_This increments the number of current signers but does not change thresholds_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| signer | address | address to add as a valid signer |

### removeSigner

```solidity
function removeSigner(address signer) external
```

Removes a signer from the smart contract wallet

_This decreases the number of current signers and validates that it will
     not create a situation where the threshold is greater than current signers_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| signer | address | address to be removed as a signer |

### setMinimumSignatures

```solidity
function setMinimumSignatures(uint256 _minimumSignatures) external
```

Sets the minimum number of signatures to execute a transaction

_This enforces minimum signatures > 0 and current signers > minimum_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minimumSignatures | uint256 | the threshold of valid signatures to execute a transaction |

### _execute

```solidity
function _execute(address to, uint256 value, bytes data, uint256 gasAmount) internal returns (bool success)
```

### _recoverCallSigner

```solidity
function _recoverCallSigner(bytes32 digest, bytes signature) internal pure returns (address signer)
```

### _getCallSignatureDigest

```solidity
function _getCallSignatureDigest(bytes32 callHash) internal view returns (bytes32 digest)
```

### _getChainlessCallSignatureDigest

```solidity
function _getChainlessCallSignatureDigest(bytes32 callHash) internal view returns (bytes32 digest)
```

### _getCallHash

```solidity
function _getCallHash(struct LayerrWallet.Call call) internal pure returns (bytes32 hash)
```

### _recover

```solidity
function _recover(bytes32 hash, bytes sig) internal pure returns (address)
```

_Recover signer address from a message by using their signature_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| hash | bytes32 | bytes32 message, the hash is the signed message. What is recovered is the signer address. |
| sig | bytes | bytes signature, the signature is generated using web3.eth.sign() |

### fallback

```solidity
fallback() external payable
```

### receive

```solidity
receive() external payable
```

## LayerrOwnable

ERC173 compliant ownership interface with two-step transfer/acceptance.

_LayerrOwnable uses two custom storage slots for current contract owner and new owner as defined in LayerrStorage._

### onlyOwner

```solidity
modifier onlyOwner()
```

### onlyNewOwner

```solidity
modifier onlyNewOwner()
```

### owner

```solidity
function owner() external view returns (address _owner)
```

Returns the current contract owner

### transferOwnership

```solidity
function transferOwnership(address _newOwner) external
```

Begins first step of ownership transfer. _newOwner will need to call acceptTransfer() to complete.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newOwner | address | address to transfer ownership of contract to |

### acceptTransfer

```solidity
function acceptTransfer() external
```

Second step of ownership transfer called by the new contract owner.

### cancelTransfer

```solidity
function cancelTransfer() external
```

Cancels ownership transfer to newOwner before the transfer is accepted.

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceID) public view virtual returns (bool)
```

EIP165 supportsInterface for introspection

### _getOwner

```solidity
function _getOwner() internal view returns (address _owner)
```

_Internal helper function to load custom storage slot address value_

### _setOwner

```solidity
function _setOwner(address _owner) internal
```

_Internal helper function to set owner address in custom storage slot_

### _getNewOwner

```solidity
function _getNewOwner() internal view returns (address _newOwner)
```

_Internal helper function to load custom storage slot address value_

### _setNewOwner

```solidity
function _setNewOwner(address _newOwner) internal
```

_Internal helper function to set new owner address in custom storage slot_

## LAYERROWNABLE_OWNER_SLOT

```solidity
bytes32 LAYERROWNABLE_OWNER_SLOT
```

## LAYERROWNABLE_NEW_OWNER_SLOT

```solidity
bytes32 LAYERROWNABLE_NEW_OWNER_SLOT
```

## LAYERRTOKEN_NAME_SLOT

```solidity
bytes32 LAYERRTOKEN_NAME_SLOT
```

## LAYERRTOKEN_SYMBOL_SLOT

```solidity
bytes32 LAYERRTOKEN_SYMBOL_SLOT
```

## LAYERRTOKEN_RENDERER_SLOT

```solidity
bytes32 LAYERRTOKEN_RENDERER_SLOT
```

## IDelegationRegistry

_See EIP-5639, new project launches can read previous cold wallet -> hot wallet delegations
from here and integrate those permissions into their flow_

### DelegationType

Delegation type

```solidity
enum DelegationType {
  NONE,
  ALL,
  CONTRACT,
  TOKEN
}
```

### DelegationInfo

Info about a single delegation, used for onchain enumeration

```solidity
struct DelegationInfo {
  enum IDelegationRegistry.DelegationType type_;
  address vault;
  address delegate;
  address contract_;
  uint256 tokenId;
}
```

### ContractDelegation

Info about a single contract-level delegation

```solidity
struct ContractDelegation {
  address contract_;
  address delegate;
}
```

### TokenDelegation

Info about a single token-level delegation

```solidity
struct TokenDelegation {
  address contract_;
  uint256 tokenId;
  address delegate;
}
```

### DelegateForAll

```solidity
event DelegateForAll(address vault, address delegate, bool value)
```

Emitted when a user delegates their entire wallet

### DelegateForContract

```solidity
event DelegateForContract(address vault, address delegate, address contract_, bool value)
```

Emitted when a user delegates a specific contract

### DelegateForToken

```solidity
event DelegateForToken(address vault, address delegate, address contract_, uint256 tokenId, bool value)
```

Emitted when a user delegates a specific token

### RevokeAllDelegates

```solidity
event RevokeAllDelegates(address vault)
```

Emitted when a user revokes all delegations

### RevokeDelegate

```solidity
event RevokeDelegate(address vault, address delegate)
```

Emitted when a user revoes all delegations for a given delegate

### delegateForAll

```solidity
function delegateForAll(address delegate, bool value) external
```

Allow the delegate to act on your behalf for all contracts

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| delegate | address | The hotwallet to act on your behalf |
| value | bool | Whether to enable or disable delegation for this address, true for setting and false for revoking |

### delegateForContract

```solidity
function delegateForContract(address delegate, address contract_, bool value) external
```

Allow the delegate to act on your behalf for a specific contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| delegate | address | The hotwallet to act on your behalf |
| contract_ | address | The address for the contract you're delegating |
| value | bool | Whether to enable or disable delegation for this address, true for setting and false for revoking |

### delegateForToken

```solidity
function delegateForToken(address delegate, address contract_, uint256 tokenId, bool value) external
```

Allow the delegate to act on your behalf for a specific token

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| delegate | address | The hotwallet to act on your behalf |
| contract_ | address | The address for the contract you're delegating |
| tokenId | uint256 | The token id for the token you're delegating |
| value | bool | Whether to enable or disable delegation for this address, true for setting and false for revoking |

### revokeAllDelegates

```solidity
function revokeAllDelegates() external
```

Revoke all delegates

### revokeDelegate

```solidity
function revokeDelegate(address delegate) external
```

Revoke a specific delegate for all their permissions

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| delegate | address | The hotwallet to revoke |

### revokeSelf

```solidity
function revokeSelf(address vault) external
```

Remove yourself as a delegate for a specific vault

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vault | address | The vault which delegated to the msg.sender, and should be removed |

### getDelegationsByDelegate

```solidity
function getDelegationsByDelegate(address delegate) external view returns (struct IDelegationRegistry.DelegationInfo[])
```

Returns all active delegations a given delegate is able to claim on behalf of

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| delegate | address | The delegate that you would like to retrieve delegations for |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IDelegationRegistry.DelegationInfo[] | info Array of DelegationInfo structs |

### getDelegatesForAll

```solidity
function getDelegatesForAll(address vault) external view returns (address[])
```

Returns an array of wallet-level delegates for a given vault

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vault | address | The cold wallet who issued the delegation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] | addresses Array of wallet-level delegates for a given vault |

### getDelegatesForContract

```solidity
function getDelegatesForContract(address vault, address contract_) external view returns (address[])
```

Returns an array of contract-level delegates for a given vault and contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vault | address | The cold wallet who issued the delegation |
| contract_ | address | The address for the contract you're delegating |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] | addresses Array of contract-level delegates for a given vault and contract |

### getDelegatesForToken

```solidity
function getDelegatesForToken(address vault, address contract_, uint256 tokenId) external view returns (address[])
```

Returns an array of contract-level delegates for a given vault's token

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vault | address | The cold wallet who issued the delegation |
| contract_ | address | The address for the contract holding the token |
| tokenId | uint256 | The token id for the token you're delegating |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] | addresses Array of contract-level delegates for a given vault's token |

### getContractLevelDelegations

```solidity
function getContractLevelDelegations(address vault) external view returns (struct IDelegationRegistry.ContractDelegation[] delegations)
```

Returns all contract-level delegations for a given vault

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vault | address | The cold wallet who issued the delegations |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| delegations | struct IDelegationRegistry.ContractDelegation[] | Array of ContractDelegation structs |

### getTokenLevelDelegations

```solidity
function getTokenLevelDelegations(address vault) external view returns (struct IDelegationRegistry.TokenDelegation[] delegations)
```

Returns all token-level delegations for a given vault

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vault | address | The cold wallet who issued the delegations |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| delegations | struct IDelegationRegistry.TokenDelegation[] | Array of TokenDelegation structs |

### checkDelegateForAll

```solidity
function checkDelegateForAll(address delegate, address vault) external view returns (bool)
```

Returns true if the address is delegated to act on the entire vault

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| delegate | address | The hotwallet to act on your behalf |
| vault | address | The cold wallet who issued the delegation |

### checkDelegateForContract

```solidity
function checkDelegateForContract(address delegate, address vault, address contract_) external view returns (bool)
```

Returns true if the address is delegated to act on your behalf for a token contract or an entire vault

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| delegate | address | The hotwallet to act on your behalf |
| vault | address | The cold wallet who issued the delegation |
| contract_ | address | The address for the contract you're delegating |

### checkDelegateForToken

```solidity
function checkDelegateForToken(address delegate, address vault, address contract_, uint256 tokenId) external view returns (bool)
```

Returns true if the address is delegated to act on your behalf for a specific token, the token's contract or an entire vault

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| delegate | address | The hotwallet to act on your behalf |
| vault | address | The cold wallet who issued the delegation |
| contract_ | address | The address for the contract you're delegating |
| tokenId | uint256 | The token id for the token you're delegating |

## IERC1155

_Required interface of an ERC1155 compliant contract, as defined in the
https://eips.ethereum.org/EIPS/eip-1155[EIP].

_Available since v3.1.__

### TransferSingle

```solidity
event TransferSingle(address operator, address from, address to, uint256 id, uint256 value)
```

_Emitted when `value` tokens of token type `id` are transferred from `from` to `to` by `operator`._

### TransferBatch

```solidity
event TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)
```

_Equivalent to multiple {TransferSingle} events, where `operator`, `from` and `to` are the same for all
transfers._

### ApprovalForAll

```solidity
event ApprovalForAll(address account, address operator, bool approved)
```

_Emitted when `account` grants or revokes permission to `operator` to transfer their tokens, according to
`approved`._

### URI

```solidity
event URI(string value, uint256 id)
```

_Emitted when the URI for token type `id` changes to `value`, if it is a non-programmatic URI.

If an {URI} event was emitted for `id`, the standard
https://eips.ethereum.org/EIPS/eip-1155#metadata-extensions[guarantees] that `value` will equal the value
returned by {IERC1155MetadataURI-uri}._

### balanceOf

```solidity
function balanceOf(address account, uint256 id) external view returns (uint256)
```

_Returns the amount of tokens of token type `id` owned by `account`.

Requirements:

- `account` cannot be the zero address._

### balanceOfBatch

```solidity
function balanceOfBatch(address[] accounts, uint256[] ids) external view returns (uint256[])
```

_xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {balanceOf}.

Requirements:

- `accounts` and `ids` must have the same length._

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) external
```

_Grants or revokes permission to `operator` to transfer the caller's tokens, according to `approved`,

Emits an {ApprovalForAll} event.

Requirements:

- `operator` cannot be the caller._

### isApprovedForAll

```solidity
function isApprovedForAll(address account, address operator) external view returns (bool)
```

_Returns true if `operator` is approved to transfer ``account``'s tokens.

See {setApprovalForAll}._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external
```

_Transfers `amount` tokens of token type `id` from `from` to `to`.

Emits a {TransferSingle} event.

Requirements:

- `to` cannot be the zero address.
- If the caller is not `from`, it must have been approved to spend ``from``'s tokens via {setApprovalForAll}.
- `from` must have a balance of tokens of type `id` of at least `amount`.
- If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
acceptance magic value._

### safeBatchTransferFrom

```solidity
function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data) external
```

_xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {safeTransferFrom}.

Emits a {TransferBatch} event.

Requirements:

- `ids` and `amounts` must have the same length.
- If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
acceptance magic value._

## ERC165

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceID) external view returns (bool)
```

Query if a contract implements an interface

_Interface identification is specified in ERC-165._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| interfaceID | bytes4 | The interface identifier, as specified in ERC-165 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | `true` if the contract implements `interfaceID` and  `interfaceID` is not 0xffffffff, `false` otherwise |

## IERC20

_Interface of the ERC20 standard as defined in the EIP._

### Transfer

```solidity
event Transfer(address from, address to, uint256 value)
```

_Emitted when `value` tokens are moved from one account (`from`) to
another (`to`).

Note that `value` may be zero._

### Approval

```solidity
event Approval(address owner, address spender, uint256 value)
```

_Emitted when the allowance of a `spender` for an `owner` is set by
a call to {approve}. `value` is the new allowance._

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

_Returns the amount of tokens in existence._

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

_Returns the amount of tokens owned by `account`._

### transfer

```solidity
function transfer(address to, uint256 amount) external returns (bool)
```

_Moves `amount` tokens from the caller's account to `to`.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

_Returns the remaining number of tokens that `spender` will be
allowed to spend on behalf of `owner` through {transferFrom}. This is
zero by default.

This value changes when {approve} or {transferFrom} are called._

### approve

```solidity
function approve(address spender, uint256 amount) external returns (bool)
```

_Sets `amount` as the allowance of `spender` over the caller's tokens.

Returns a boolean value indicating whether the operation succeeded.

IMPORTANT: Beware that changing an allowance with this method brings the risk
that someone may use both the old and the new allowance by unfortunate
transaction ordering. One possible solution to mitigate this race
condition is to first reduce the spender's allowance to 0 and set the
desired value afterwards:
https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

Emits an {Approval} event._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amount) external returns (bool)
```

_Moves `amount` tokens from `from` to `to` using the
allowance mechanism. `amount` is then deducted from the caller's
allowance.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._

## IERC4906

### MetadataUpdate

```solidity
event MetadataUpdate(uint256 _tokenId)
```

_This event emits when the metadata of a token is changed.
So that the third-party platforms such as NFT market could
timely update the images and related attributes of the NFT._

### BatchMetadataUpdate

```solidity
event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId)
```

_This event emits when the metadata of a range of tokens is changed.
So that the third-party platforms such as NFT market could
timely update the images and related attributes of the NFTs._

## IERC721

_Required interface of an ERC721 compliant contract._

### Transfer

```solidity
event Transfer(address from, address to, uint256 tokenId)
```

_Emitted when `tokenId` token is transferred from `from` to `to`._

### Approval

```solidity
event Approval(address owner, address approved, uint256 tokenId)
```

_Emitted when `owner` enables `approved` to manage the `tokenId` token._

### ApprovalForAll

```solidity
event ApprovalForAll(address owner, address operator, bool approved)
```

_Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets._

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256 balance)
```

_Returns the number of tokens in ``owner``'s account._

### ownerOf

```solidity
function ownerOf(uint256 tokenId) external view returns (address owner)
```

_Returns the owner of the `tokenId` token.

Requirements:

- `tokenId` must exist._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) external
```

_Safely transfers `tokenId` token from `from` to `to`.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must exist and be owned by `from`.
- If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
- If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.

Emits a {Transfer} event._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) external
```

_Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
are aware of the ERC721 protocol to prevent tokens from being forever locked.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must exist and be owned by `from`.
- If the caller is not `from`, it must have been allowed to move this token by either {approve} or {setApprovalForAll}.
- If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.

Emits a {Transfer} event._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) external
```

_Transfers `tokenId` token from `from` to `to`.

WARNING: Note that the caller is responsible to confirm that the recipient is capable of receiving ERC721
or else they may be permanently lost. Usage of {safeTransferFrom} prevents loss, though the caller must
understand this adds an external call which potentially creates a reentrancy vulnerability.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must be owned by `from`.
- If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.

Emits a {Transfer} event._

### approve

```solidity
function approve(address to, uint256 tokenId) external
```

_Gives permission to `to` to transfer `tokenId` token to another account.
The approval is cleared when the token is transferred.

Only a single account can be approved at a time, so approving the zero address clears previous approvals.

Requirements:

- The caller must own the token or be an approved operator.
- `tokenId` must exist.

Emits an {Approval} event._

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) external
```

_Approve or remove `operator` as an operator for the caller.
Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.

Requirements:

- The `operator` cannot be the caller.

Emits an {ApprovalForAll} event._

### getApproved

```solidity
function getApproved(uint256 tokenId) external view returns (address operator)
```

_Returns the account approved for `tokenId` token.

Requirements:

- `tokenId` must exist._

### isApprovedForAll

```solidity
function isApprovedForAll(address owner, address operator) external view returns (bool)
```

_Returns if the `operator` is allowed to manage all of the assets of `owner`.

See {setApprovalForAll}_

## ILayerr1155

ILayerr1155 interface defines functions required in an ERC1155 token contract to callable by the LayerrMinter contract.

### airdrop

```solidity
function airdrop(address[] recipients, uint256[] tokenIds, uint256[] amounts) external
```

Mints tokens to the recipients, each recipient gets the corresponding tokenId in the `tokenIds` array

_This function should be protected by a role so that it is not callable by any address
`recipients`, `tokenIds` and `amounts` arrays must be equal length, each recipient will receive the corresponding 
     tokenId and amount from the `tokenIds` and `amounts` arrays_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipients | address[] | addresses to airdrop tokens to |
| tokenIds | uint256[] | ids of tokens to be airdropped to recipients |
| amounts | uint256[] | amounts of tokens to be airdropped to recipients |

### mintTokenId

```solidity
function mintTokenId(address minter, address to, uint256 tokenId, uint256 amount) external
```

Mints `amount` of `tokenId` to `to`.

_`minter` and `to` may be the same address but are passed as two separate parameters to properly account for
     allowlist mints where a minter is using a delegated wallet to mint_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address that the mint count will be credited to |
| to | address | address that will receive the tokens |
| tokenId | uint256 | id of the token to mint |
| amount | uint256 | amount of token to mint |

### mintBatchTokenIds

```solidity
function mintBatchTokenIds(address minter, address to, uint256[] tokenIds, uint256[] amounts) external
```

Mints `amount` of `tokenId` to `to`.

_`minter` and `to` may be the same address but are passed as two separate parameters to properly account for
     allowlist mints where a minter is using a delegated wallet to mint_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address that the mint count will be credited to |
| to | address | address that will receive the tokens |
| tokenIds | uint256[] | array of ids to mint |
| amounts | uint256[] | array of amounts to mint |

### burnTokenId

```solidity
function burnTokenId(address from, uint256 tokenId, uint256 amount) external
```

Burns `tokenId` from `from` address

_This function should check that the caller has permission to burn tokens on behalf of `from`_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address to burn the tokenId from |
| tokenId | uint256 | id of token to be burned |
| amount | uint256 | amount of `tokenId` to burn from `from` |

### burnBatchTokenIds

```solidity
function burnBatchTokenIds(address from, uint256[] tokenIds, uint256[] amounts) external
```

Burns `tokenId` from `from` address

_This function should check that the caller has permission to burn tokens on behalf of `from`_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address to burn the tokenId from |
| tokenIds | uint256[] | array of token ids to be burned |
| amounts | uint256[] | array of amounts to burn from `from` |

### updateMetadataSpecificTokens

```solidity
function updateMetadataSpecificTokens(uint256[] tokenIds) external
```

Emits URI event for tokens provided

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenIds | uint256[] | array of token ids to emit MetadataUpdate event for |

### totalSupply

```solidity
function totalSupply(uint256 id) external view returns (uint256)
```

Returns the total supply of ERC1155 tokens in circulation for given `id`.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | the token id to check total supply of |

### totalMintedCollectionAndMinter

```solidity
function totalMintedCollectionAndMinter(address minter, uint256 id) external view returns (uint256 totalMinted, uint256 minterMinted)
```

Returns the total number of tokens minted for the contract and the number of tokens minted by the `minter`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address to check for number of tokens minted |
| id | uint256 | the token id to check number of tokens minted for |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| totalMinted | uint256 | total number of ERC1155 tokens for given `id` minted since token launch |
| minterMinted | uint256 | total number of ERC1155 tokens for given `id` minted by the `minter` |

## ILayerr20

ILayerr20 interface defines functions required in an ERC20 token contract to callable by the LayerrMinter contract.

### ArrayLengthMismatch

```solidity
error ArrayLengthMismatch()
```

_Thrown when two or more sets of arrays are supplied that require equal lengths but differ in length._

### airdrop

```solidity
function airdrop(address[] recipients, uint256[] amounts) external
```

Mints tokens to the recipients in amounts specified

_This function should be protected by a role so that it is not callable by any address_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipients | address[] | addresses to airdrop tokens to |
| amounts | uint256[] | amount of tokens to airdrop to recipients |

### mint

```solidity
function mint(address minter, address to, uint256 amount) external
```

Mints `amount` of ERC20 tokens to the `to` address

_`minter` and `to` may be the same address but are passed as two separate parameters to properly account for
     allowlist mints where a minter is using a delegated wallet to mint_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address that the minted amount will be credited to |
| to | address | address that will receive the tokens being minted |
| amount | uint256 | amount of tokens being minted |

### burn

```solidity
function burn(address from, uint256 amount) external
```

Burns `amount` of ERC20 tokens from the `from` address

_This function should check that the caller has a sufficient spend allowance to burn these tokens_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address that the tokens will be burned from |
| amount | uint256 | amount of tokens to be burned |

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

Returns the total supply of ERC20 tokens in circulation.

### totalMintedTokenAndMinter

```solidity
function totalMintedTokenAndMinter(address minter) external view returns (uint256 totalMinted, uint256 minterMinted)
```

Returns the total number of tokens minted for the contract and the number of tokens minted by the `minter`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address to check for number of tokens minted |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| totalMinted | uint256 | total number of ERC20 tokens minted since token launch |
| minterMinted | uint256 | total number of ERC20 tokens minted by the `minter` |

## ILayerr721

ILayerr721 interface defines functions required in an ERC721 token contract to callable by the LayerrMinter contract.

_ILayerr721 should be used for non-sequential token minting._

### ArrayLengthMismatch

```solidity
error ArrayLengthMismatch()
```

_Thrown when two or more sets of arrays are supplied that require equal lengths but differ in length._

### airdrop

```solidity
function airdrop(address[] recipients, uint256[] tokenIds) external
```

Mints tokens to the recipients, each recipient gets the corresponding tokenId in the `tokenIds` array

_This function should be protected by a role so that it is not callable by any address_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipients | address[] | addresses to airdrop tokens to |
| tokenIds | uint256[] | ids of tokens to be airdropped to recipients |

### mintTokenId

```solidity
function mintTokenId(address minter, address to, uint256 tokenId) external
```

Mints `tokenId` to `to`.

_`minter` and `to` may be the same address but are passed as two separate parameters to properly account for
     allowlist mints where a minter is using a delegated wallet to mint_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address that the mint count will be credited to |
| to | address | address that will receive the token |
| tokenId | uint256 | the id of the token to mint |

### mintBatchTokenIds

```solidity
function mintBatchTokenIds(address minter, address to, uint256[] tokenIds) external
```

Mints `tokenIds` to `to`.

_`minter` and `to` may be the same address but are passed as two separate parameters to properly account for
     allowlist mints where a minter is using a delegated wallet to mint_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address that the mint count will be credited to |
| to | address | address that will receive the tokens |
| tokenIds | uint256[] | the ids of tokens to mint |

### burnTokenId

```solidity
function burnTokenId(address from, uint256 tokenId) external
```

Burns `tokenId` from `from` address

_This function should check that the caller has permission to burn tokens on behalf of `from`_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address to burn the tokenId from |
| tokenId | uint256 | id of token to be burned |

### burnBatchTokenIds

```solidity
function burnBatchTokenIds(address from, uint256[] tokenIds) external
```

Burns `tokenIds` from `from` address

_This function should check that the caller has permission to burn tokens on behalf of `from`_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address to burn the tokenIds from |
| tokenIds | uint256[] | ids of tokens to be burned |

### updateMetadataAllTokens

```solidity
function updateMetadataAllTokens() external
```

Emits ERC-4906 BatchMetadataUpdate event for all tokens

### updateMetadataSpecificTokens

```solidity
function updateMetadataSpecificTokens(uint256[] tokenIds) external
```

Emits ERC-4906 MetadataUpdate event for tokens provided

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenIds | uint256[] | array of token ids to emit MetadataUpdate event for |

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

Returns the total supply of ERC721 tokens in circulation.

### totalMintedCollectionAndMinter

```solidity
function totalMintedCollectionAndMinter(address minter) external view returns (uint256 totalMinted, uint256 minterMinted)
```

Returns the total number of tokens minted for the contract and the number of tokens minted by the `minter`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address to check for number of tokens minted |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| totalMinted | uint256 | total number of ERC721 tokens minted since token launch |
| minterMinted | uint256 | total number of ERC721 tokens minted by the `minter` |

## ILayerr721A

ILayerr721A interface defines functions required in an ERC721A token contract to callable by the LayerrMinter contract.

_ILayerr721A should be used for sequential token minting._

### ArrayLengthMismatch

```solidity
error ArrayLengthMismatch()
```

_Thrown when two or more sets of arrays are supplied that require equal lengths but differ in length._

### airdrop

```solidity
function airdrop(address[] recipients, uint256[] amounts) external
```

Mints tokens to the recipients, each recipient receives the corresponding amount of tokens in the `amounts` array

_This function should be protected by a role so that it is not callable by any address_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipients | address[] | addresses to airdrop tokens to |
| amounts | uint256[] | amount of tokens that should be airdropped to each recipient |

### mintSequential

```solidity
function mintSequential(address minter, address to, uint256 quantity) external
```

Sequentially mints `quantity` of tokens to `to`

_`minter` and `to` may be the same address but are passed as two separate parameters to properly account for
     allowlist mints where a minter is using a delegated wallet to mint_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address that the mint count will be credited to |
| to | address | address that will receive the tokens |
| quantity | uint256 | the number of tokens to sequentially mint to `to` |

### burnTokenId

```solidity
function burnTokenId(address from, uint256 tokenId) external
```

Burns `tokenId` from `from` address

_This function should check that the caller has permission to burn tokens on behalf of `from`_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address to burn the tokenId from |
| tokenId | uint256 | id of token to be burned |

### burnBatchTokenIds

```solidity
function burnBatchTokenIds(address from, uint256[] tokenIds) external
```

Burns `tokenIds` from `from` address

_This function should check that the caller has permission to burn tokens on behalf of `from`_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address to burn the tokenIds from |
| tokenIds | uint256[] | ids of tokens to be burned |

### updateMetadataAllTokens

```solidity
function updateMetadataAllTokens() external
```

Emits ERC-4906 BatchMetadataUpdate event for all tokens

### updateMetadataSpecificTokens

```solidity
function updateMetadataSpecificTokens(uint256[] tokenIds) external
```

Emits ERC-4906 MetadataUpdate event for tokens provided

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenIds | uint256[] | array of token ids to emit MetadataUpdate event for |

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

Returns the total supply of ERC721 tokens in circulation.

### totalMintedCollectionAndMinter

```solidity
function totalMintedCollectionAndMinter(address minter) external view returns (uint256 totalMinted, uint256 minterMinted)
```

Returns the total number of tokens minted for the contract and the number of tokens minted by the `minter`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address to check for number of tokens minted |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| totalMinted | uint256 | total number of ERC721 tokens minted since token launch |
| minterMinted | uint256 | total number of ERC721 tokens minted by the `minter` |

## ILayerrMinter

ILayerrMinter interface defines functions required in the LayerrMinter to be callable by token contracts

### MintOrderFulfilled

```solidity
event MintOrderFulfilled(bytes32 mintParametersDigest, address minter, uint256 quantity)
```

_Event emitted when a mint order is fulfilled_

### ContractAllowedSignerUpdate

```solidity
event ContractAllowedSignerUpdate(address _contract, address _signer, bool _allowed)
```

_Event emitted when a token contract updates an allowed signer for EIP712 signatures_

### ContractOracleUpdated

```solidity
event ContractOracleUpdated(address _contract, address _oracle, bool _allowed)
```

_Event emitted when a token contract updates an allowed oracle signer for offchain authorization of a wallet to use a signature_

### SignerNonceIncremented

```solidity
event SignerNonceIncremented(address _signer, uint256 _nonce)
```

_Event emitted when a signer updates their nonce with LayerrMinter. Updating a nonce invalidates all previously signed EIP712 signatures._

### SignatureValidityUpdated

```solidity
event SignatureValidityUpdated(address _contract, bool invalid, bytes32 mintParametersDigests)
```

_Event emitted when a specific signature's validity is updated with the LayerrMinter contract._

### InsufficientPayment

```solidity
error InsufficientPayment()
```

_Thrown when the amount of native tokens supplied in msg.value is insufficient for the mint order_

### PaymentFailed

```solidity
error PaymentFailed()
```

_Thrown when a payment fails to be forwarded to the intended recipient_

### InvalidPaymentTokenType

```solidity
error InvalidPaymentTokenType()
```

_Thrown when a MintParameters payment token uses a token type value other than native or ERC20_

### InvalidBurnTokenType

```solidity
error InvalidBurnTokenType()
```

_Thrown when a MintParameters burn token uses a token type value other than ERC20, ERC721 or ERC1155_

### InvalidMintTokenType

```solidity
error InvalidMintTokenType()
```

_Thrown when a MintParameters mint token uses a token type value other than ERC20, ERC721 or ERC1155_

### InvalidBurnType

```solidity
error InvalidBurnType()
```

_Thrown when a MintParameters burn token uses a burn type value other than contract burn or send to dead_

### InvalidBurnTokenId

```solidity
error InvalidBurnTokenId()
```

_Thrown when a MintParameters burn token requires a specific burn token id and the tokenId supplied does not match_

### CannotBurnMultipleERC721WithSameId

```solidity
error CannotBurnMultipleERC721WithSameId()
```

_Thrown when a MintParameters burn token requires a specific ERC721 token and the burn amount is greater than 1_

### MintHasNotStarted

```solidity
error MintHasNotStarted()
```

_Thrown when attempting to mint with MintParameters that have a start time greater than the current block time_

### MintHasEnded

```solidity
error MintHasEnded()
```

_Thrown when attempting to mint with MintParameters that have an end time less than the current block time_

### InvalidMerkleProof

```solidity
error InvalidMerkleProof()
```

_Thrown when a MintParameters has a merkleroot set but the supplied merkle proof is invalid_

### MintExceedsMaxSupply

```solidity
error MintExceedsMaxSupply()
```

_Thrown when a MintOrder will cause a token's minted supply to exceed the defined maximum supply in MintParameters_

### MintExceedsMaxPerWallet

```solidity
error MintExceedsMaxPerWallet()
```

_Thrown when a MintOrder will cause a minter's minted amount to exceed the defined max per wallet in MintParameters_

### CannotMintMultipleERC721WithSameId

```solidity
error CannotMintMultipleERC721WithSameId()
```

_Thrown when a MintParameters mint token has a specific ERC721 token and the mint amount is greater than 1_

### NotAllowedSigner

```solidity
error NotAllowedSigner()
```

_Thrown when the recovered signer for the MintParameters is not an allowed signer for the mint token_

### SignerNonceInvalid

```solidity
error SignerNonceInvalid()
```

_Thrown when the recovered signer's nonce does not match the current nonce in LayerrMinter_

### SignatureInvalid

```solidity
error SignatureInvalid()
```

_Thrown when a signature has been marked as invalid for a mint token contract_

### InvalidOracleSignature

```solidity
error InvalidOracleSignature()
```

_Thrown when MintParameters requires an oracle signature and the recovered signer is not an allowed oracle for the contract_

### ExceedsMaxSignatureUsage

```solidity
error ExceedsMaxSignatureUsage()
```

_Thrown when MintParameters has a max signature use set and the MintOrder will exceed the maximum uses_

### InvalidSignatureToIncrementNonce

```solidity
error InvalidSignatureToIncrementNonce()
```

_Thrown when attempting to increment nonce on behalf of another account and the signature is invalid_

### setContractAllowedSigner

```solidity
function setContractAllowedSigner(address _signer, bool _allowed) external
```

This function is called by token contracts to update allowed signers for minting

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _signer | address | address of the EIP712 signer |
| _allowed | bool | if the `_signer` is allowed to sign for minting |

### setContractAllowedOracle

```solidity
function setContractAllowedOracle(address _oracle, bool _allowed) external
```

This function is called by token contracts to update allowed oracles for offchain authorizations

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _oracle | address | address of the oracle |
| _allowed | bool | if the `_oracle` is allowed to sign offchain authorizations |

### setSignatureValidity

```solidity
function setSignatureValidity(bytes32[] mintParametersDigests, bool invalid) external
```

This function is called by token contracts to update validity of signatures for the LayerrMinter contract

_`invalid` should be true to invalidate signatures, the default state of `invalid` being false means 
     a signature is valid for a contract assuming all other conditions are met_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintParametersDigests | bytes32[] | an array of message digests for MintParameters to update validity of |
| invalid | bool | if the supplied digests will be marked as valid or invalid |

### incrementSignerNonce

```solidity
function incrementSignerNonce() external
```

Increments the nonce for a signer to invalidate all previous signed MintParameters

### incrementNonceFor

```solidity
function incrementNonceFor(address signer, bytes signature) external
```

Increments the nonce on behalf of another account by validating a signature from that account

_The signature is an eth personal sign message of the current signer nonce plus the chain id
     ex. current nonce 0 on chain 5 would be a signature of \x19Ethereum Signed Message:\n15
         current nonce 50 on chain 1 would be a signature of \x19Ethereum Signed Message:\n251_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| signer | address | account to increment nonce for |
| signature | bytes | signature proof that the request is coming from the account |

### mint

```solidity
function mint(struct MintOrder mintOrder) external payable
```

Validates and processes a single MintOrder, tokens are minted to msg.sender

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintOrder | struct MintOrder | struct containing the details of the mint order |

### mintBatch

```solidity
function mintBatch(struct MintOrder[] mintOrders) external payable
```

Validates and processes an array of MintOrders, tokens are minted to msg.sender

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintOrders | struct MintOrder[] | array of structs containing the details of the mint orders |

### mintTo

```solidity
function mintTo(address mintToWallet, struct MintOrder mintOrder, uint256 paymentContext) external payable
```

Validates and processes a single MintOrder, tokens are minted to `mintToWallet`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintToWallet | address | the address tokens will be minted to |
| mintOrder | struct MintOrder | struct containing the details of the mint order |
| paymentContext | uint256 | Contextual information related to the payment process                     (Note: This parameter is required for integration with                      the payment processor and does not impact the behavior                      of the function) |

### mintBatchTo

```solidity
function mintBatchTo(address mintToWallet, struct MintOrder[] mintOrders, uint256 paymentContext) external payable
```

Validates and processes an array of MintOrders, tokens are minted to `mintToWallet`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintToWallet | address | the address tokens will be minted to |
| mintOrders | struct MintOrder[] | array of structs containing the details of the mint orders |
| paymentContext | uint256 | Contextual information related to the payment process                     (Note: This parameter is required for integration with                      the payment processor and does not impact the behavior                      of the function) |

## ILayerrRenderer

ILayerrRenderer interface defines functions required in LayerrRenderer to be callable by token contracts

### RenderType

```solidity
enum RenderType {
  LAYERR_HOSTED,
  PREREVEAL,
  BASE_PLUS_TOKEN
}
```

### PaymentFailed

```solidity
error PaymentFailed()
```

_Thrown when a payment fails for Layerr-hosted IPFS_

### NotContractOwner

```solidity
error NotContractOwner()
```

_Thrown when a call is made for an owner-function by a non-contract owner_

### InvalidSignature

```solidity
error InvalidSignature()
```

_Thrown when a signature is not made by the authorized account_

### tokenURI

```solidity
function tokenURI(address contractAddress, uint256 tokenId) external view returns (string)
```

Generates a tokenURI for the `contractAddress` and `tokenId`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | token contract address to render a token URI for |
| tokenId | uint256 | token id to render |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | uri for the token metadata |

### contractURI

```solidity
function contractURI(address contractAddress) external view returns (string)
```

Generates a contractURI for the `contractAddress`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | contract address to render a contract URI for |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | uri for the contract metadata |

## ILayerrToken

ILayerrToken interface defines functions required to be supported by the Layerr platform

### LayerrContractDeployed

```solidity
event LayerrContractDeployed()
```

_Emitted when the contract is deployed so that it can be indexed and assigned to its owner_

### MintExtensionUpdated

```solidity
event MintExtensionUpdated(address mintExtension, bool allowed)
```

_Emitted when a mint extension is updated to allowed or disallowed_

### RendererUpdated

```solidity
event RendererUpdated(address renderer)
```

_Emitted when the contract's renderer is updated_

### NotValidMintingExtension

```solidity
error NotValidMintingExtension()
```

_Thrown when a caller that is not a mint extension attempts to execute a mint function_

### NotAuthorized

```solidity
error NotAuthorized()
```

_Thrown when a non-owner attempts to execute an only owner function_

### WithdrawFailed

```solidity
error WithdrawFailed()
```

_Thrown when attempting to withdraw funds from the contract and the call fails_

### name

```solidity
function name() external view returns (string)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | name the name of the token |

### symbol

```solidity
function symbol() external view returns (string)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | symbol the token symbol |

### renderer

```solidity
function renderer() external view returns (address)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | renderer the address that will render token/contract URIs |

### setRenderer

```solidity
function setRenderer(address _renderer) external
```

Sets the renderer for token/contract URIs

_This function should be restricted to contract owners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _renderer | address | address to set as the token/contract URI renderer |

### setMintExtension

```solidity
function setMintExtension(address _extension, bool _allowed) external
```

Sets whether or not an address is allowed to call minting functions

_This function should be restricted to contract owners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _extension | address | address of the mint extension to update |
| _allowed | bool | if the mint extension is allowed to mint tokens |

### setContractAllowedSigner

```solidity
function setContractAllowedSigner(address _extension, address _signer, bool _allowed) external
```

This function calls the mint extension to update `_signer`'s allowance

_This function should be restricted to contract owners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _extension | address | address of the mint extension to update |
| _signer | address | address of the signer to update |
| _allowed | bool | if `_signer` is allowed to sign for `_extension` |

### setContractAllowedOracle

```solidity
function setContractAllowedOracle(address _extension, address _oracle, bool _allowed) external
```

This function calls the mint extension to update `_oracle`'s allowance

_This function should be restricted to contract owners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _extension | address | address of the mint extension to update |
| _oracle | address | address of the oracle to update |
| _allowed | bool | if `_oracle` is allowed to sign for `_extension` |

### setSignatureValidity

```solidity
function setSignatureValidity(address _extension, bytes32[] signatureDigests, bool invalid) external
```

This function calls the mint extension to update signature validity

_This function should be restricted to contract owners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _extension | address | address of the mint extension to update |
| signatureDigests | bytes32[] | hash digests of signatures parameters to update |
| invalid | bool | true if the signature digests should be marked as invalid |

### setRoyalty

```solidity
function setRoyalty(uint96 pct, address royaltyReciever) external
```

This function updates the ERC2981 royalty percentages

_This function should be restricted to contract owners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| pct | uint96 | royalty percentage in BPS |
| royaltyReciever | address | address to receive royalties |

### editContract

```solidity
function editContract(string _name, string _symbol) external
```

This function updates the token contract's name and symbol

_This function should be restricted to contract owners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _name | string | new name for the token contract |
| _symbol | string | new symbol for the token contract |

## IOwnable

### NotContractOwner

```solidity
error NotContractOwner()
```

_Thrown when a non-owner is attempting to perform an owner function_

### OwnershipTransferred

```solidity
event OwnershipTransferred(address previousOwner, address newOwner)
```

_Emitted when contract ownership is transferred to a new owner_

### owner

```solidity
function owner() external view returns (address)
```

Get the address of the owner

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The address of the owner. |

### transferOwnership

```solidity
function transferOwnership(address _newOwner) external
```

Set the address of the new owner of the contract

_Set _newOwner to address(0) to renounce any ownership._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newOwner | address | The address of the new owner of the contract |

## BURN_TYPE_CONTRACT_BURN

```solidity
uint256 BURN_TYPE_CONTRACT_BURN
```

## BURN_TYPE_SEND_TO_DEAD

```solidity
uint256 BURN_TYPE_SEND_TO_DEAD
```

## ERC2981

Simple ERC2981 NFT Royalty Standard implementation.

### RoyaltyOverflow

```solidity
error RoyaltyOverflow()
```

_The royalty fee numerator exceeds the fee denominator._

### RoyaltyReceiverIsZeroAddress

```solidity
error RoyaltyReceiverIsZeroAddress()
```

_The royalty receiver cannot be the zero address._

### constructor

```solidity
constructor() internal
```

_Checks that `_feeDenominator` is non-zero._

### _feeDenominator

```solidity
function _feeDenominator() internal pure virtual returns (uint96)
```

_Returns the denominator for the royalty amount.
Defaults to 10000, which represents fees in basis points.
Override this function to return a custom amount if needed._

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool result)
```

_Returns true if this contract implements the interface defined by `interfaceId`.
See: https://eips.ethereum.org/EIPS/eip-165
This function call must use less than 30000 gas._

### royaltyInfo

```solidity
function royaltyInfo(uint256 tokenId, uint256 salePrice) public view virtual returns (address receiver, uint256 royaltyAmount)
```

_Returns the `receiver` and `royaltyAmount` for `tokenId` sold at `salePrice`._

### _setDefaultRoyalty

```solidity
function _setDefaultRoyalty(address receiver, uint96 feeNumerator) internal virtual
```

_Sets the default royalty `receiver` and `feeNumerator`.

Requirements:
- `receiver` must not be the zero address.
- `feeNumerator` must not be greater than the fee denominator._

### _deleteDefaultRoyalty

```solidity
function _deleteDefaultRoyalty() internal virtual
```

_Sets the default royalty `receiver` and `feeNumerator` to zero._

### _setTokenRoyalty

```solidity
function _setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) internal virtual
```

_Sets the royalty `receiver` and `feeNumerator` for `tokenId`.

Requirements:
- `receiver` must not be the zero address.
- `feeNumerator` must not be greater than the fee denominator._

### _resetTokenRoyalty

```solidity
function _resetTokenRoyalty(uint256 tokenId) internal virtual
```

_Sets the royalty `receiver` and `feeNumerator` for `tokenId` to zero._

## MerkleProof

Gas optimized verification of proof of inclusion for a leaf in a Merkle tree.

### verify

```solidity
function verify(bytes32[] proof, bytes32 root, bytes32 leaf) internal pure returns (bool isValid)
```

_Returns whether `leaf` exists in the Merkle tree with `root`, given `proof`._

### verifyCalldata

```solidity
function verifyCalldata(bytes32[] proof, bytes32 root, bytes32 leaf) internal pure returns (bool isValid)
```

_Returns whether `leaf` exists in the Merkle tree with `root`, given `proof`._

### verifyMultiProof

```solidity
function verifyMultiProof(bytes32[] proof, bytes32 root, bytes32[] leaves, bool[] flags) internal pure returns (bool isValid)
```

_Returns whether all `leaves` exist in the Merkle tree with `root`,
given `proof` and `flags`._

### verifyMultiProofCalldata

```solidity
function verifyMultiProofCalldata(bytes32[] proof, bytes32 root, bytes32[] leaves, bool[] flags) internal pure returns (bool isValid)
```

_Returns whether all `leaves` exist in the Merkle tree with `root`,
given `proof` and `flags`._

### emptyProof

```solidity
function emptyProof() internal pure returns (bytes32[] proof)
```

_Returns an empty calldata bytes32 array._

### emptyLeaves

```solidity
function emptyLeaves() internal pure returns (bytes32[] leaves)
```

_Returns an empty calldata bytes32 array._

### emptyFlags

```solidity
function emptyFlags() internal pure returns (bool[] flags)
```

_Returns an empty calldata bool array._

## EIP712Domain

_EIP712 Domain for signature verification_

```solidity
struct EIP712Domain {
  string name;
  string version;
  uint256 chainId;
  address verifyingContract;
}
```

## MintOrder

_MintOrders contain MintParameters as defined by a token creator
     along with proofs required to validate the MintParameters and 
     parameters specific to the mint being performed.

     `mintParameters` are the parameters signed by the token creator
     `quantity` is a multiplier for mintTokens, burnTokens and paymentTokens
         defined in mintParameters
     `mintParametersSignature` is the signature from the token creator
     `oracleSignature` is a signature of the hash of the mintParameters digest 
         and msg.sender. The recovered signer must be an allowed oracle for 
         the token contract if oracleSignatureRequired is true for mintParameters.
     `merkleProof` is the proof that is checked if merkleRoot is not bytes(0) in
         mintParameters
     `suppliedBurnTokenIds` is an array of tokenIds to be used when processing
         burnTokens. There must be one item in the array for each ERC1155 burnToken
         regardless of `quantity` and `quantity` items in the array for each ERC721
         burnToken.
     `referrer` is the address that will receive a portion of a paymentToken if
         not address(0) and paymentToken's referralBPS is greater than 0
     `vaultWallet` is used for allowlist mints if the msg.sender address it not on
         the allowlist but their delegate.cash vault wallet is._

```solidity
struct MintOrder {
  struct MintParameters mintParameters;
  uint256 quantity;
  bytes mintParametersSignature;
  bytes oracleSignature;
  bytes32[] merkleProof;
  uint256[] suppliedBurnTokenIds;
  address referrer;
  address vaultWallet;
}
```

## MintParameters

_MintParameters define the tokens to be minted and conditions that must be met
     for the mint to be successfully processed.

     `mintTokens` is an array of tokens that will be minted
     `burnTokens` is an array of tokens required to be burned
     `paymentTokens` is an array of tokens required as payment
     `startTime` is the UTC timestamp of when the mint will start
     `endTime` is the UTC timestamp of when the mint will end
     `signatureMaxUses` limits the number of mints that can be performed with the
         specific mintParameters/signature
     `merkleRoot` is the root of the merkletree for allowlist minting
     `nonce` is the signer nonce that can be incremented on the LayerrMinter 
         contract to invalidate all previous signatures
     `oracleSignatureRequired` if true requires a secondary signature to process the mint_

```solidity
struct MintParameters {
  struct MintToken[] mintTokens;
  struct BurnToken[] burnTokens;
  struct PaymentToken[] paymentTokens;
  uint256 startTime;
  uint256 endTime;
  uint256 signatureMaxUses;
  bytes32 merkleRoot;
  uint256 nonce;
  bool oracleSignatureRequired;
}
```

## MintToken

_Defines the token that will be minted
     
     `contractAddress` address of contract to mint tokens from
     `specificTokenId` used for ERC721 - 
         if true, mint is non-sequential ERC721
         if false, mint is sequential ERC721A
     `tokenType` is the type of token being minted defined in TokenTypes.sol
     `tokenId` the tokenId to mint if specificTokenId is true
     `mintAmount` is the quantity to be minted
     `maxSupply` is checked against the total minted amount at time of mint
         minting reverts if `mintAmount` * `quantity` will cause total minted to 
         exceed `maxSupply`
     `maxMintPerWallet` is checked against the number minted for the wallet
         minting reverts if `mintAmount` * `quantity` will cause wallet minted to 
         exceed `maxMintPerWallet`_

```solidity
struct MintToken {
  address contractAddress;
  bool specificTokenId;
  uint256 tokenType;
  uint256 tokenId;
  uint256 mintAmount;
  uint256 maxSupply;
  uint256 maxMintPerWallet;
}
```

## BurnToken

_Defines the token that will be burned
     
     `contractAddress` address of contract to burn tokens from
     `specificTokenId` specifies if the user has the option of choosing any token
         from the contract or if they must burn a specific token
     `tokenType` is the type of token being burned, defined in TokenTypes.sol
     `burnType` is the type of burn to perform, burn function call or transfer to 
         dead address, defined in BurnType.sol
     `tokenId` the tokenId to burn if specificTokenId is true
     `burnAmount` is the quantity to be burned_

```solidity
struct BurnToken {
  address contractAddress;
  bool specificTokenId;
  uint256 tokenType;
  uint256 burnType;
  uint256 tokenId;
  uint256 burnAmount;
}
```

## PaymentToken

_Defines the token that will be used for payment
     
     `contractAddress` address of contract to for payment if ERC20
         if tokenType is native token then this should be set to 0x000...000
         to save calldata gas units
     `tokenType` is the type of token being used for payment, defined in TokenTypes.sol
     `payTo` the address that will receive the payment
     `paymentAmount` the amount for the payment in base units for the token
         ex. a native payment on Ethereum for 1 ETH would be specified in wei
         which would be 1**18 wei
     `referralBPS` is the percentage of the payment in BPS that will be sent to the 
         `referrer` on the MintOrder if `referralBPS` is greater than 0 and `referrer`
         is not address(0)_

```solidity
struct PaymentToken {
  address contractAddress;
  uint256 tokenType;
  address payTo;
  uint256 paymentAmount;
  uint256 referralBPS;
}
```

## ReentrancyGuard

Simple reentrancy guard to prevent callers from re-entering the LayerrMinter mint functions

### ReentrancyProhibited

```solidity
error ReentrancyProhibited()
```

### NonReentrant

```solidity
modifier NonReentrant()
```

## SignatureVerification

Recovers the EIP712 signer for MintParameters and oracle signers
        for the LayerrMinter contract.

### constructor

```solidity
constructor() public
```

### _recoverMintParametersSigner

```solidity
function _recoverMintParametersSigner(struct MintParameters input, bytes signature) internal view returns (address signer, bytes32 digest)
```

Recovers the signer address for the supplied mint parameters and signature

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| input | struct MintParameters | MintParameters to recover the signer for |
| signature | bytes | Signature for the MintParameters `_input` to recover signer |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| signer | address | recovered signer of `signature` and `_input` |
| digest | bytes32 | hash digest of `_input` |

### _recoverOracleSigner

```solidity
function _recoverOracleSigner(address minter, bytes mintParametersSignature, bytes oracleSignature) internal pure returns (address signer)
```

Recovers the signer address for the supplied oracle signature

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address of wallet performing the mint |
| mintParametersSignature | bytes | signature of MintParameters to check oracle signature of |
| oracleSignature | bytes | supplied oracle signature |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| signer | address | recovered oracle signer address |

### _validateIncrementNonceSigner

```solidity
function _validateIncrementNonceSigner(address signer, uint256 currentNonce, bytes signature) internal view returns (bool valid)
```

Recovers the signer address for the increment nonce transaction

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| signer | address | address of the account to increment nonce |
| currentNonce | uint256 | current nonce for the signer account |
| signature | bytes | signature of message to validate |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| valid | bool | if the signature came from the signer |

### _recover

```solidity
function _recover(bytes32 hash, bytes sig) internal pure returns (address)
```

_Recover signer address from a message by using their signature_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| hash | bytes32 | bytes32 message, the hash is the signed message. What is recovered is the signer address. |
| sig | bytes | bytes signature, the signature is generated using web3.eth.sign() |

### _toString

```solidity
function _toString(uint256 value) internal pure virtual returns (string str)
```

### _getMintTokenArrayHash

```solidity
function _getMintTokenArrayHash(struct MintToken[] mintTokens) internal pure returns (bytes32 hash)
```

### _getBurnTokenArrayHash

```solidity
function _getBurnTokenArrayHash(struct BurnToken[] burnTokens) internal pure returns (bytes32 hash)
```

### _getPaymentTokenArrayHash

```solidity
function _getPaymentTokenArrayHash(struct PaymentToken[] paymentTokens) internal pure returns (bytes32 hash)
```

### _getMintTokenHash

```solidity
function _getMintTokenHash(struct MintToken mintToken) internal pure returns (bytes32 hash)
```

### _getBurnTokenHash

```solidity
function _getBurnTokenHash(struct BurnToken burnToken) internal pure returns (bytes32 hash)
```

### _getPaymentTokenHash

```solidity
function _getPaymentTokenHash(struct PaymentToken paymentToken) internal pure returns (bytes32 hash)
```

### _getMintParametersHash

```solidity
function _getMintParametersHash(struct MintParameters mintParameters) internal pure returns (bytes32 hash)
```

### getMintParametersSignatureDigest

```solidity
function getMintParametersSignatureDigest(struct MintParameters mintParameters) external view returns (bytes32 digest)
```

## StringValue

_Simple struct to store a string value in a custom storage slot_

```solidity
struct StringValue {
  string value;
}
```

## AddressValue

_Simple struct to store an address value in a custom storage slot_

```solidity
struct AddressValue {
  address value;
}
```

## TOKEN_TYPE_NATIVE

```solidity
uint256 TOKEN_TYPE_NATIVE
```

## TOKEN_TYPE_ERC20

```solidity
uint256 TOKEN_TYPE_ERC20
```

## TOKEN_TYPE_ERC721

```solidity
uint256 TOKEN_TYPE_ERC721
```

## TOKEN_TYPE_ERC1155

```solidity
uint256 TOKEN_TYPE_ERC1155
```

## EIP712_DOMAIN_TYPEHASH

```solidity
bytes32 EIP712_DOMAIN_TYPEHASH
```

## MINTPARAMETERS_TYPEHASH

```solidity
bytes32 MINTPARAMETERS_TYPEHASH
```

## MINTTOKEN_TYPEHASH

```solidity
bytes32 MINTTOKEN_TYPEHASH
```

## BURNTOKEN_TYPEHASH

```solidity
bytes32 BURNTOKEN_TYPEHASH
```

## PAYMENTTOKEN_TYPEHASH

```solidity
bytes32 PAYMENTTOKEN_TYPEHASH
```

## LayerrInterfaceInspect

### getLayerr20InterfaceId

```solidity
function getLayerr20InterfaceId() external pure returns (bytes4)
```

### getLayerr721InterfaceId

```solidity
function getLayerr721InterfaceId() external pure returns (bytes4)
```

### getLayerr721AInterfaceId

```solidity
function getLayerr721AInterfaceId() external pure returns (bytes4)
```

### getLayerr1155InterfaceId

```solidity
function getLayerr1155InterfaceId() external pure returns (bytes4)
```

### getLayerrTokenInterfaceId

```solidity
function getLayerrTokenInterfaceId() external pure returns (bytes4)
```

### getLayerrRendererInterfaceId

```solidity
function getLayerrRendererInterfaceId() external pure returns (bytes4)
```

## LayerrRendererTest

LayerrRenderer handles contractURI and tokenURI generation for contracts
        deployed on the Layerr platform. Contract owners have complete control of 
        their tokens with the ability to set their own renderer, host their tokens
        with Layerr, set all tokens to a prereveal image, or set a base URI that
        token ids will be appended to.
        Tokens hosted with Layerr will automatically generate a tokenURI with the
        `layerrBaseTokenUri`/{chainId}/{contractAddress}/{tokenId} to allow new tokens
        to be minted without updating a base uri.
        For long term storage, Layerr-hosted tokens can be swept onto Layerr's IPFS
        solution.

### owner

```solidity
address owner
```

_Layerr-owned EOA that is allowed to update the base token and base contract URIs for Layerr-hosted non-IPFS tokens_

### layerrSigner

```solidity
address layerrSigner
```

_Layerr's signature account for checking parameters of tokens swept to Layerr IPFS_

### layerrBaseTokenUri

```solidity
string layerrBaseTokenUri
```

_The base token URI that chainId, contractAddress and tokenId are added to for rendering_

### layerrBaseContractUri

```solidity
string layerrBaseContractUri
```

_The base contract URI that chainId and contractAddress are added to for rendering_

### contractRenderType

```solidity
mapping(address => enum ILayerrRenderer.RenderType) contractRenderType
```

_The rendering type for a token contract, defaults to LAYERR_HOSTED_

### contractBaseTokenUri

```solidity
mapping(address => string) contractBaseTokenUri
```

_Base token URI set by the token contract owner for BASE_PLUS_TOKEN render type and LAYERR_HOSTED tokens on IPFS_

### contractContractUri

```solidity
mapping(address => string) contractContractUri
```

_Token contract URI set by the token contract owner_

### layerrHostedAllTokensOnIPFS

```solidity
mapping(address => bool) layerrHostedAllTokensOnIPFS
```

_mapping of token contract addresses that flag a token contract as having all of its tokens hosted on Layerr IPFS_

### layerrHostedTokensOnIPFS

```solidity
mapping(address => mapping(uint256 => uint256)) layerrHostedTokensOnIPFS
```

_bitmap of token ids for a token contract that have been moved to Layerr hosted IPFS_

### layerrHostedIPFSExpiration

```solidity
mapping(address => uint256) layerrHostedIPFSExpiration
```

_mapping of token contract addresses with the UTC timestamp of when the IPFS hosting is paid through_

### onlyOwner

```solidity
modifier onlyOwner()
```

### constructor

```solidity
constructor() public
```

### tokenURI

```solidity
function tokenURI(address contractAddress, uint256 tokenId) external view returns (string _tokenURI)
```

Generates a tokenURI for the `contractAddress` and `tokenId`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | token contract address to render a token URI for |
| tokenId | uint256 | token id to render |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenURI | string | uri for the token metadata |

### contractURI

```solidity
function contractURI(address contractAddress) external view returns (string _contractURI)
```

Generates a contractURI for the `contractAddress`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | contract address to render a contract URI for |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| _contractURI | string | uri for the contract metadata |

### setContractBaseTokenUri

```solidity
function setContractBaseTokenUri(address contractAddress, string baseTokenUri, enum ILayerrRenderer.RenderType renderType) external
```

Updates rendering settings for a contract. Must be the ERC173 owner for the token contract to call.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | address of the contract to set the base token URI for |
| baseTokenUri | string | base token URI to set for `contractAddress` |
| renderType | enum ILayerrRenderer.RenderType | sets the current render type for the contract |

### setContractUri

```solidity
function setContractUri(address contractAddress, string contractUri) external
```

Updates rendering settings for a contract. Must be the ERC173 owner for the token contract to call.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | address of the contract to set the base token URI for |
| contractUri | string | contract URI to set for `contractAddress` |

### setContractBaseTokenUriForLayerrHostedIPFS

```solidity
function setContractBaseTokenUriForLayerrHostedIPFS(address contractAddress, string baseTokenUri, bool allTokens, uint256[] tokenIds, uint256 ipfsExpiration, bytes signature) external payable
```

Updates the base token URI to sweep tokens to IPFS for Layerr hosted tokens
        This allows new tokens to continue to be minted on the contract with the default
        rendering address while existing tokens are moved onto IPFS for long term storage.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | address of the token contract |
| baseTokenUri | string | base token URI to set for the contract's tokens |
| allTokens | bool | set to true for larger collections that are done minting                  avoids setting each token id in the bitmap for gas savings but new tokens                  will not render with the default rendering address |
| tokenIds | uint256[] | array of token ids that are being swept to Layerr hosted IPFS |
| ipfsExpiration | uint256 | UTC timestamp that the IPFS hosting is paid through |
| signature | bytes | signature by Layerr account to confirm the parameters supplied |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

### setLayerrSigner

```solidity
function setLayerrSigner(address _layerrSigner) external
```

Owner function to set the Layerr signature account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _layerrSigner | address | address that will be used to check signatures |

### setLayerrBaseTokenUri

```solidity
function setLayerrBaseTokenUri(string _layerrBaseTokenUri) external
```

Owner function to set the default token rendering URI

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _layerrBaseTokenUri | string | base token uri to be used for default token rendering |

### setLayerrBaseContractUri

```solidity
function setLayerrBaseContractUri(string _layerrBaseContractUri) external
```

Owner function to set the default contract rendering URI

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _layerrBaseContractUri | string | base contract uri to be used for default rendering |

### _isLayerrHostedIPFS

```solidity
function _isLayerrHostedIPFS(address contractAddress, uint256 tokenId) internal view returns (bool isIPFS)
```

Checks to see if a token has been flagged as being hosted on Layerr IPFS

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | token contract address to check |
| tokenId | uint256 | id of the token to check |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| isIPFS | bool | if token has been flagged as being hosted on Layerr IPFS |

### _setLayerrHostedIPFS

```solidity
function _setLayerrHostedIPFS(address contractAddress, uint256 tokenId) internal
```

Flags a token as being hosted on Layerr IPFS in a bitmap

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | token contract address |
| tokenId | uint256 | id of the token |

### _toString

```solidity
function _toString(uint256 value) internal pure virtual returns (string str)
```

### _toString

```solidity
function _toString(address value) internal pure returns (string)
```

### _char

```solidity
function _char(bytes1 b) internal pure returns (bytes1 c)
```

### _recover

```solidity
function _recover(bytes32 hash, bytes sig) internal pure returns (address)
```

_Recover signer address from a message by using their signature_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| hash | bytes32 | bytes32 message, the hash is the signed message. What is recovered is the signer address. |
| sig | bytes | bytes signature, the signature is generated using web3.eth.sign() |

## LayerrWalletTest

A multi-sig smart contract wallet with support for
        both transactions that are chain-specific and 
        transactions that are replayable on all chains that
        the contract is deployed on.

### Call

_Defines call parameters for transactions_

```solidity
struct Call {
  uint256 nonce;
  address to;
  uint256 value;
  bytes data;
  uint256 gas;
}
```

### InvalidCaller

```solidity
error InvalidCaller()
```

_Thrown when non-address(this) attempts to call external functions that must be called from address(this)_

### SignaturesOutOfOrder

```solidity
error SignaturesOutOfOrder()
```

_Thrown when signatures are supplied out of order, signatures must be supplied in ascending signer id order_

### AddressAlreadySigner

```solidity
error AddressAlreadySigner()
```

_Thrown when attempting to add a signer that already exists_

### AddressNotSigner

```solidity
error AddressNotSigner()
```

_Thrown when attempting to remove an address that is not currently a signer_

### NotEnoughSigners

```solidity
error NotEnoughSigners()
```

@dev Thrown when remove signer/threshold update would make it impossible to execute a transaction
      or when a transaction is submitted without enough signatures to meet the threshold.

### InvalidNonce

```solidity
error InvalidNonce()
```

_Thrown when the supplied call's nonce is not the current nonce for the contract_

### CannotCallSelf

```solidity
error CannotCallSelf()
```

_Thrown when attempting to call the add/remove signer and threshold functions with a chain-specific call_

### CallFailed

```solidity
error CallFailed()
```

_Thrown when the call results in a revert_

### SignerRemoved

```solidity
event SignerRemoved(address signer)
```

_Emitted when removing a signer_

### SignerAdded

```solidity
event SignerAdded(address signer, uint256 signerId)
```

_Emitted when adding a signer_

### EIP712_DOMAIN_TYPEHASH

```solidity
bytes32 EIP712_DOMAIN_TYPEHASH
```

### CHAINLESS_EIP712_DOMAIN_TYPEHASH

```solidity
bytes32 CHAINLESS_EIP712_DOMAIN_TYPEHASH
```

### CALL_TYPEHASH

```solidity
bytes32 CALL_TYPEHASH
```

### signerIds

```solidity
mapping(address => uint256) signerIds
```

_mapping of signer addresses to their id, addresses with id of 0 are not valid signers_

### minimumSignatures

```solidity
uint32 minimumSignatures
```

_the minimum number of valid signatures to execute a transaction_

### currentSigners

```solidity
uint32 currentSigners
```

_the number of signers that are currently authorized to sign a transaction_

### chainCallNonce

```solidity
uint32 chainCallNonce
```

_the current nonce for transactions that can only be executed on a specific chain_

### chainlessCallNonce

```solidity
uint32 chainlessCallNonce
```

_the current nonce for transactions that can be executed across all chains_

### constructor

```solidity
constructor() public
```

### chainlessCall

```solidity
function chainlessCall(struct LayerrWalletTest.Call call, bytes[] signatures) external
```

Chainless calls are not chain specific and can be replayed on any chain
        that the contract is deployed to.

_This is intended to be used for protocol updates that need to be applied 
     across all chains._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| call | struct LayerrWalletTest.Call | struct containing the details of the call transaction to execute |
| signatures | bytes[] | signatures to validate the call |

### chainCall

```solidity
function chainCall(struct LayerrWalletTest.Call call, bytes[] signatures) external
```

Chain calls are chain specific and cannot be replayed to other chains.

_This is intended to be used for transactions that are chain-specific 
     such as treasury management where values and addresses that values are being
     sent to may differ from chain to chain._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| call | struct LayerrWalletTest.Call | struct containing the details of the call transaction to execute |
| signatures | bytes[] | signatures to validate the call |

### addSigner

```solidity
function addSigner(address signer) external
```

Adds a signer to the smart contract wallet

_This increments the number of current signers but does not change thresholds_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| signer | address | address to add as a valid signer |

### removeSigner

```solidity
function removeSigner(address signer) external
```

Removes a signer from the smart contract wallet

_This decreases the number of current signers and validates that it will
     not create a situation where the threshold is greater than current signers_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| signer | address | address to be removed as a signer |

### setMinimumSignatures

```solidity
function setMinimumSignatures(uint256 _minimumSignatures) external
```

Sets the minimum number of signatures to execute a transaction

_This enforces minimum signatures > 0 and current signers > minimum_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _minimumSignatures | uint256 | the threshold of valid signatures to execute a transaction |

### _execute

```solidity
function _execute(address to, uint256 value, bytes data, uint256 gasAmount) internal returns (bool success)
```

### _recoverCallSigner

```solidity
function _recoverCallSigner(bytes32 digest, bytes signature) internal pure returns (address signer)
```

### _getCallSignatureDigest

```solidity
function _getCallSignatureDigest(bytes32 callHash) internal view returns (bytes32 digest)
```

### _getChainlessCallSignatureDigest

```solidity
function _getChainlessCallSignatureDigest(bytes32 callHash) internal view returns (bytes32 digest)
```

### _getCallHash

```solidity
function _getCallHash(struct LayerrWalletTest.Call call) internal pure returns (bytes32 hash)
```

### _recover

```solidity
function _recover(bytes32 hash, bytes sig) internal pure returns (address)
```

_Recover signer address from a message by using their signature_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| hash | bytes32 | bytes32 message, the hash is the signed message. What is recovered is the signer address. |
| sig | bytes | bytes signature, the signature is generated using web3.eth.sign() |

### fallback

```solidity
fallback() external payable
```

### receive

```solidity
receive() external payable
```

## ERC1155P__IERC1155Receiver

_Interface of ERC1155 token receiver._

### onERC1155Received

```solidity
function onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes data) external returns (bytes4)
```

### onERC1155BatchReceived

```solidity
function onERC1155BatchReceived(address operator, address from, uint256[] ids, uint256[] values, bytes data) external returns (bytes4)
```

## ERC1155P__IERC1155MetadataURI

_Interface for IERC1155MetadataURI._

### uri

```solidity
function uri(uint256 id) external view returns (string)
```

_Returns the URI for token type `id`.

If the `\{id\}` substring is present in the URI, it must be replaced by
clients with the actual token type ID._

## ERC1155P

_Implementation of the basic standard multi-token.
See https://eips.ethereum.org/EIPS/eip-1155 including the Metadata extension.
Optimized for lower gas for users collecting multiple tokens.

Assumptions:
- An owner cannot have more than 2**16 - 1 of a single token
- The maximum token ID cannot exceed 2**100 - 1_

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_Returns true if this contract implements the interface defined by
`interfaceId`. See the corresponding
[EIP section](https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified)
to learn more about how these ids are created.

This function call must use less than 30000 gas._

### balanceOf

```solidity
function balanceOf(address account, uint256 id) public view virtual returns (uint256)
```

_See {IERC1155-balanceOf}.

Requirements:

- `account` cannot be the zero address._

### _numberMinted

```solidity
function _numberMinted(address account, uint256 id) internal view returns (uint256)
```

_Gets the amount of tokens minted by an account for a given token id_

### balanceOfBatch

```solidity
function balanceOfBatch(address[] accounts, uint256[] ids) public view virtual returns (uint256[])
```

_See {IERC1155-balanceOfBatch}.

Requirements:

- `accounts` and `ids` must have the same length._

### isApprovedForAll

```solidity
function isApprovedForAll(address account, address operator) public view virtual returns (bool _approved)
```

_See {IERC1155-isApprovedForAll}._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) public virtual
```

_See {IERC1155-safeTransferFrom}._

### safeBatchTransferFrom

```solidity
function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data) public virtual
```

_See {IERC1155-safeBatchTransferFrom}._

### _safeTransferFrom

```solidity
function _safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) internal virtual
```

_Transfers `amount` tokens of token type `id` from `from` to `to`.

Emits a {TransferSingle} event.

Requirements:

- `to` cannot be the zero address.
- `from` must have a balance of tokens of type `id` of at least `amount`.
- If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
acceptance magic value._

### _safeBatchTransferFrom

```solidity
function _safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal virtual
```

_xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {_safeTransferFrom}.

Emits a {TransferBatch} event.

Requirements:

- If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
acceptance magic value._

### _mint

```solidity
function _mint(address minter, address to, uint256 id, uint256 amount, bytes data) internal virtual
```

_Creates `amount` tokens of token type `id`, and assigns them to `to`.

Emits a {TransferSingle} event.

Requirements:

- `to` cannot be the zero address.
- If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
acceptance magic value._

### _mintBatch

```solidity
function _mintBatch(address minter, address to, uint256[] ids, uint256[] amounts, bytes data) internal virtual
```

_xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {_mint}.

Emits a {TransferBatch} event.

Requirements:

- `ids` and `amounts` must have the same length.
- If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
acceptance magic value._

### _burn

```solidity
function _burn(address from, uint256 id, uint256 amount) internal virtual
```

_Destroys `amount` tokens of token type `id` from `from`

Emits a {TransferSingle} event.

Requirements:

- `from` cannot be the zero address.
- `from` must have at least `amount` tokens of token type `id`._

### _burnBatch

```solidity
function _burnBatch(address from, uint256[] ids, uint256[] amounts) internal virtual
```

_xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {_burn}.

Emits a {TransferBatch} event.

Requirements:

- `ids` and `amounts` must have the same length._

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) public virtual
```

_Approve or remove `operator` as an operator for the caller.
Operators can call {transferFrom} or {safeTransferFrom}
for any token owned by the caller.

Emits an {ApprovalForAll} event._

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address operator, address from, address to, uint256 id, uint256 amount, bytes data) internal virtual
```

_Hook that is called before any single token transfer. This includes minting
and burning.

Calling conditions:

- When `from` and `to` are both non-zero, `amount` of ``from``'s tokens
of token type `id` will be  transferred to `to`.
- When `from` is zero, `amount` tokens of token type `id` will be minted
for `to`.
- when `to` is zero, `amount` of ``from``'s tokens of token type `id`
will be burned.
- `from` and `to` are never both zero.

To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks]._

### _beforeBatchTokenTransfer

```solidity
function _beforeBatchTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal virtual
```

_Hook that is called before any batch token transfer. This includes minting
and burning.

Calling conditions (for each `id` and `amount` pair):

- When `from` and `to` are both non-zero, `amount` of ``from``'s tokens
of token type `id` will be  transferred to `to`.
- When `from` is zero, `amount` tokens of token type `id` will be minted
for `to`.
- when `to` is zero, `amount` of ``from``'s tokens of token type `id`
will be burned.
- `from` and `to` are never both zero.
- `ids` and `amounts` have the same, non-zero length.

To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks]._

### _afterTokenTransfer

```solidity
function _afterTokenTransfer(address operator, address from, address to, uint256 id, uint256 amount, bytes data) internal virtual
```

_Hook that is called after any single token transfer. This includes minting
and burning.

Calling conditions:

- When `from` and `to` are both non-zero, `amount` of ``from``'s tokens
of token type `id` will be  transferred to `to`.
- When `from` is zero, `amount` tokens of token type `id` will be minted
for `to`.
- when `to` is zero, `amount` of ``from``'s tokens of token type `id`
will be burned.
- `from` and `to` are never both zero.

To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks]._

### _afterBatchTokenTransfer

```solidity
function _afterBatchTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal virtual
```

_Hook that is called after any batch token transfer. This includes minting
and burning.

Calling conditions (for each `id` and `amount` pair):

- When `from` and `to` are both non-zero, `amount` of ``from``'s tokens
of token type `id` will be  transferred to `to`.
- When `from` is zero, `amount` tokens of token type `id` will be minted
for `to`.
- when `to` is zero, `amount` of ``from``'s tokens of token type `id`
will be burned.
- `from` and `to` are never both zero.
- `ids` and `amounts` have the same, non-zero length.

To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks]._

### _msgSenderERC1155P

```solidity
function _msgSenderERC1155P() internal view virtual returns (address)
```

_Returns the message sender (defaults to `msg.sender`).

If you are writing GSN compatible contracts, you need to override this function._

### _toString

```solidity
function _toString(uint256 value) internal pure virtual returns (string str)
```

_Converts a uint256 to its ASCII string decimal representation._

### _revert

```solidity
function _revert(bytes4 errorSelector) internal pure
```

_For more efficient reverts._

## IERC1155P

_Required interface of an ERC1155 compliant contract, as defined in the
https://eips.ethereum.org/EIPS/eip-1155[EIP].

_Available since v3.1.__

### BalanceQueryForZeroAddress

```solidity
error BalanceQueryForZeroAddress()
```

Cannot query the balance for the zero address.

### ArrayLengthMismatch

```solidity
error ArrayLengthMismatch()
```

Arrays cannot be different lengths.

### BurnFromZeroAddress

```solidity
error BurnFromZeroAddress()
```

Cannot burn from the zero address.

### MintToZeroAddress

```solidity
error MintToZeroAddress()
```

Cannot mint to the zero address.

### MintZeroQuantity

```solidity
error MintZeroQuantity()
```

The quantity of tokens minted must be more than zero.

### BurnExceedsBalance

```solidity
error BurnExceedsBalance()
```

The quantity of tokens being burned is greater than account balance.

### TransferExceedsBalance

```solidity
error TransferExceedsBalance()
```

The quantity of tokens being transferred is greater than account balance.

### ExceedsMaximumBalance

```solidity
error ExceedsMaximumBalance()
```

The resulting token balance exceeds the maximum storable by ERC1155P

### TransferCallerNotOwnerNorApproved

```solidity
error TransferCallerNotOwnerNorApproved()
```

The caller must own the token or be an approved operator.

### TransferToNonERC1155ReceiverImplementer

```solidity
error TransferToNonERC1155ReceiverImplementer()
```

Cannot safely transfer to a contract that does not implement the
ERC1155Receiver interface.

### TransferToZeroAddress

```solidity
error TransferToZeroAddress()
```

Cannot transfer to the zero address.

### ExceedsMaximumTokenId

```solidity
error ExceedsMaximumTokenId()
```

Exceeds max token ID

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```

_Returns true if this contract implements the interface defined by
`interfaceId`. See the corresponding
[EIP section](https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified)
to learn more about how these ids are created.

This function call must use less than 30000 gas._

### TransferSingle

```solidity
event TransferSingle(address operator, address from, address to, uint256 id, uint256 value)
```

_Emitted when `value` tokens of token type `id` are transferred from `from` to `to` by `operator`._

### TransferBatch

```solidity
event TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)
```

_Equivalent to multiple {TransferSingle} events, where `operator`, `from` and `to` are the same for all
transfers._

### ApprovalForAll

```solidity
event ApprovalForAll(address account, address operator, bool approved)
```

_Emitted when `account` grants or revokes permission to `operator` to transfer their tokens, according to
`approved`._

### URI

```solidity
event URI(string value, uint256 id)
```

_Emitted when the URI for token type `id` changes to `value`, if it is a non-programmatic URI.

If an {URI} event was emitted for `id`, the standard
https://eips.ethereum.org/EIPS/eip-1155#metadata-extensions[guarantees] that `value` will equal the value
returned by {IERC1155MetadataURI-uri}._

### balanceOf

```solidity
function balanceOf(address account, uint256 id) external view returns (uint256)
```

_Returns the amount of tokens of token type `id` owned by `account`.

Requirements:

- `account` cannot be the zero address._

### balanceOfBatch

```solidity
function balanceOfBatch(address[] accounts, uint256[] ids) external view returns (uint256[])
```

_xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {balanceOf}.

Requirements:

- `accounts` and `ids` must have the same length._

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) external
```

_Grants or revokes permission to `operator` to transfer the caller's tokens, according to `approved`,

Emits an {ApprovalForAll} event.

Requirements:

- `operator` cannot be the caller._

### isApprovedForAll

```solidity
function isApprovedForAll(address account, address operator) external view returns (bool)
```

_Returns true if `operator` is approved to transfer ``account``'s tokens.

See {setApprovalForAll}._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external
```

_Transfers `amount` tokens of token type `id` from `from` to `to`.

Emits a {TransferSingle} event.

Requirements:

- `to` cannot be the zero address.
- If the caller is not `from`, it must have been approved to spend ``from``'s tokens via {setApprovalForAll}.
- `from` must have a balance of tokens of type `id` of at least `amount`.
- If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
acceptance magic value._

### safeBatchTransferFrom

```solidity
function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data) external
```

_xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {safeTransferFrom}.

Emits a {TransferBatch} event.

Requirements:

- `ids` and `amounts` must have the same length.
- If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
acceptance magic value._

## Layerr1155

Layerr1155 is an ERC1155 contract built for the Layerr platform using
        the ERC1155P implementation for gas efficient mints, burns, purchases,  
        and transfers of multiple tokens.

### uri

```solidity
function uri(uint256 id) public view virtual returns (string)
```

Returns the URI for a given `tokenId`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of token to return URI of |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | tokenURI location of the token metadata |

### contractURI

```solidity
function contractURI() public view returns (string)
```

Returns the URI for the contract metadata

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | contractURI location of the contract metadata |

### mintTokenId

```solidity
function mintTokenId(address minter, address to, uint256 id, uint256 amount) external
```

Mints `amount` of `tokenId` to `to`.

_`minter` and `to` may be the same address but are passed as two separate parameters to properly account for
     allowlist mints where a minter is using a delegated wallet to mint_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address that the mint count will be credited to |
| to | address | address that will receive the tokens |
| id | uint256 |  |
| amount | uint256 | amount of token to mint |

### mintBatchTokenIds

```solidity
function mintBatchTokenIds(address minter, address to, uint256[] ids, uint256[] amounts) external
```

Mints `amount` of `tokenId` to `to`.

_`minter` and `to` may be the same address but are passed as two separate parameters to properly account for
     allowlist mints where a minter is using a delegated wallet to mint_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address that the mint count will be credited to |
| to | address | address that will receive the tokens |
| ids | uint256[] |  |
| amounts | uint256[] | array of amounts to mint |

### burnTokenId

```solidity
function burnTokenId(address from, uint256 tokenId, uint256 amount) external
```

Burns `tokenId` from `from` address

_This function should check that the caller has permission to burn tokens on behalf of `from`_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address to burn the tokenId from |
| tokenId | uint256 | id of token to be burned |
| amount | uint256 | amount of `tokenId` to burn from `from` |

### burnBatchTokenIds

```solidity
function burnBatchTokenIds(address from, uint256[] tokenIds, uint256[] amounts) external
```

Burns `tokenId` from `from` address

_This function should check that the caller has permission to burn tokens on behalf of `from`_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address to burn the tokenId from |
| tokenIds | uint256[] | array of token ids to be burned |
| amounts | uint256[] | array of amounts to burn from `from` |

### totalSupply

```solidity
function totalSupply(uint256 id) public view returns (uint256)
```

Returns the total supply of ERC1155 tokens in circulation for given `id`.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | the token id to check total supply of |

### totalMintedCollectionAndMinter

```solidity
function totalMintedCollectionAndMinter(address minter, uint256 id) external view returns (uint256 totalMinted, uint256 minterMinted)
```

Returns the total number of tokens minted for the contract and the number of tokens minted by the `minter`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address to check for number of tokens minted |
| id | uint256 | the token id to check number of tokens minted for |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| totalMinted | uint256 | total number of ERC1155 tokens for given `id` minted since token launch |
| minterMinted | uint256 | total number of ERC1155 tokens for given `id` minted by the `minter` |

### airdrop

```solidity
function airdrop(address[] recipients, uint256[] tokenIds, uint256[] amounts) external
```

Mints tokens to the recipients, each recipient gets the corresponding tokenId in the `tokenIds` array

_This function should be protected by a role so that it is not callable by any address
`recipients`, `tokenIds` and `amounts` arrays must be equal length, each recipient will receive the corresponding 
     tokenId and amount from the `tokenIds` and `amounts` arrays_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipients | address[] | addresses to airdrop tokens to |
| tokenIds | uint256[] | ids of tokens to be airdropped to recipients |
| amounts | uint256[] | amounts of tokens to be airdropped to recipients |

### setOperatorFilter

```solidity
function setOperatorFilter(address operatorFilterRegistry) external
```

Subscribes to an operator filter registry

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operatorFilterRegistry | address | operator filter address to subscribe to |

### removeOperatorFilter

```solidity
function removeOperatorFilter() external
```

Unsubscribes from the operator filter registry

### updateMetadataSpecificTokens

```solidity
function updateMetadataSpecificTokens(uint256[] tokenIds) external
```

Emits URI event for tokens provided

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenIds | uint256[] | array of token ids to emit MetadataUpdate event for |

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) public
```

OPERATOR FILTER OVERRIDES

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, uint256 amount, bytes data) public
```

### safeBatchTransferFrom

```solidity
function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data) public virtual
```

_See {IERC1155-safeBatchTransferFrom}._

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

ERC165

## ERC1155PSupply

_Extension of ERC1155 that adds tracking of total supply per id.

Useful for scenarios where Fungible and Non-fungible tokens have to be
clearly identified. Note: While a totalSupply of 1 might mean the
corresponding is an NFT, there is no guarantees that no other token with the
same id are not going to be minted._

### ExceedsMaximumTotalSupply

```solidity
error ExceedsMaximumTotalSupply()
```

Total supply exceeds maximum.

### totalSupply

```solidity
function totalSupply(uint256 id) public view virtual returns (uint256 _totalSupply)
```

_Total amount of tokens with a given id._

### totalMinted

```solidity
function totalMinted(uint256 id) public view virtual returns (uint256 _totalMinted)
```

_Total amount of tokens minted with a given id._

### exists

```solidity
function exists(uint256 id) public view virtual returns (bool)
```

_Indicates whether any token exist with a given id, or not._

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address, address from, address to, uint256 id, uint256 amount, bytes) internal virtual
```

_See {ERC1155-_beforeTokenTransfer}._

### _beforeBatchTokenTransfer

```solidity
function _beforeBatchTokenTransfer(address, address from, address to, uint256[] ids, uint256[] amounts, bytes) internal virtual
```

_See {ERC1155-_beforeTokenTransfer}._

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_Returns true if this contract implements the interface defined by
`interfaceId`. See the corresponding
[EIP section](https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified)
to learn more about how these ids are created.

This function call must use less than 30000 gas._

## ERC20

Simple ERC20 + EIP-2612 implementation.

_Note:
The ERC20 standard allows minting and transferring to and from the zero address,
minting and transferring zero tokens, as well as self-approvals.
For performance, this implementation WILL NOT revert for such actions.
Please add any checks with overrides if desired._

### TotalSupplyOverflow

```solidity
error TotalSupplyOverflow()
```

_The total supply has overflowed._

### AllowanceOverflow

```solidity
error AllowanceOverflow()
```

_The allowance has overflowed._

### AllowanceUnderflow

```solidity
error AllowanceUnderflow()
```

_The allowance has underflowed._

### BalanceOverflow

```solidity
error BalanceOverflow()
```

_The balance has overflowed_

### InsufficientBalance

```solidity
error InsufficientBalance()
```

_Insufficient balance._

### InsufficientAllowance

```solidity
error InsufficientAllowance()
```

_Insufficient allowance._

### InvalidPermit

```solidity
error InvalidPermit()
```

_The permit is invalid._

### PermitExpired

```solidity
error PermitExpired()
```

_The permit has expired._

### Transfer

```solidity
event Transfer(address from, address to, uint256 amount)
```

_Emitted when `amount` tokens is transferred from `from` to `to`._

### Approval

```solidity
event Approval(address owner, address spender, uint256 amount)
```

_Emitted when `amount` tokens is approved by `owner` to be used by `spender`._

### name

```solidity
function name() public view virtual returns (string)
```

_Returns the name of the token._

### symbol

```solidity
function symbol() public view virtual returns (string)
```

_Returns the symbol of the token._

### decimals

```solidity
function decimals() public view virtual returns (uint8)
```

_Returns the decimals places of the token._

### totalSupply

```solidity
function totalSupply() public view virtual returns (uint256 result)
```

_Returns the amount of tokens in existence._

### _totalMinted

```solidity
function _totalMinted() internal view virtual returns (uint256 result)
```

_Returns the amount of tokens minted._

### _totalBurned

```solidity
function _totalBurned() internal view virtual returns (uint256 result)
```

_Returns the amount of tokens burned._

### balanceOf

```solidity
function balanceOf(address owner) public view virtual returns (uint256 result)
```

_Returns the amount of tokens owned by `owner`._

### _numberMinted

```solidity
function _numberMinted(address wallet) internal view virtual returns (uint256 result)
```

_Returns the amount of tokens minted by `wallet`._

### allowance

```solidity
function allowance(address owner, address spender) public view virtual returns (uint256 result)
```

_Returns the amount of tokens that `spender` can spend on behalf of `owner`._

### approve

```solidity
function approve(address spender, uint256 amount) public virtual returns (bool)
```

_Sets `amount` as the allowance of `spender` over the caller's tokens.

Emits a {Approval} event._

### increaseAllowance

```solidity
function increaseAllowance(address spender, uint256 difference) public virtual returns (bool)
```

_Atomically increases the allowance granted to `spender` by the caller.

Emits a {Approval} event._

### decreaseAllowance

```solidity
function decreaseAllowance(address spender, uint256 difference) public virtual returns (bool)
```

_Atomically decreases the allowance granted to `spender` by the caller.

Emits a {Approval} event._

### transfer

```solidity
function transfer(address to, uint256 amount) public virtual returns (bool)
```

_Transfer `amount` tokens from the caller to `to`.

Requirements:
- `from` must at least have `amount`.

Emits a {Transfer} event._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amount) public virtual returns (bool)
```

_Transfers `amount` tokens from `from` to `to`.

Note: does not update the allowance if it is the maximum uint256 value.

Requirements:
- `from` must at least have `amount`.
- The caller must have at least `amount` of allowance to transfer the tokens of `from`.

Emits a {Transfer} event._

### nonces

```solidity
function nonces(address owner) public view virtual returns (uint256 result)
```

_Returns the current nonce for `owner`.
This value is used to compute the signature for EIP-2612 permit._

### permit

```solidity
function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public virtual
```

_Sets `value` as the allowance of `spender` over the tokens of `owner`,
authorized by a signed approval by `owner`.

Emits a {Approval} event._

### DOMAIN_SEPARATOR

```solidity
function DOMAIN_SEPARATOR() public view virtual returns (bytes32 result)
```

_Returns the EIP-2612 domains separator._

### _mint

```solidity
function _mint(address to, uint256 amount) internal virtual
```

_Mints `amount` tokens to `to`, increasing the total supply.

Emits a {Transfer} event._

### _burn

```solidity
function _burn(address from, uint256 amount) internal virtual
```

_Burns `amount` tokens from `from`, reducing the total supply.

Emits a {Transfer} event._

### _transfer

```solidity
function _transfer(address from, address to, uint256 amount) internal virtual
```

_Moves `amount` of tokens from `from` to `to`._

### _spendAllowance

```solidity
function _spendAllowance(address owner, address spender, uint256 amount) internal virtual
```

_Updates the allowance of `owner` for `spender` based on spent `amount`._

### _approve

```solidity
function _approve(address owner, address spender, uint256 amount) internal virtual
```

_Sets `amount` as the allowance of `spender` over the tokens of `owner`.

Emits a {Approval} event._

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual
```

_Hook that is called before any transfer of tokens.
This includes minting and burning._

### _afterTokenTransfer

```solidity
function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual
```

_Hook that is called after any transfer of tokens.
This includes minting and burning._

## Layerr20

Layerr20 is an ERC20 contract built for the Layerr platform using
        the Solady ERC20 implementation.

### contractURI

```solidity
function contractURI() public view returns (string)
```

Returns the URI for the contract metadata

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | contractURI location of the contract metadata |

### name

```solidity
function name() public view virtual returns (string)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | name the name of the token |

### symbol

```solidity
function symbol() public view virtual returns (string)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | symbol the token symbol |

### mint

```solidity
function mint(address, address to, uint256 amount) external
```

Mints `amount` of ERC20 tokens to the `to` address

_`minter` and `to` may be the same address but are passed as two separate parameters to properly account for
     allowlist mints where a minter is using a delegated wallet to mint_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
|  | address |  |
| to | address | address that will receive the tokens being minted |
| amount | uint256 | amount of tokens being minted |

### burn

```solidity
function burn(address from, uint256 amount) external
```

Burns `amount` of ERC20 tokens from the `from` address

_This function should check that the caller has a sufficient spend allowance to burn these tokens_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address that the tokens will be burned from |
| amount | uint256 | amount of tokens to be burned |

### totalSupply

```solidity
function totalSupply() public view returns (uint256)
```

Returns the total supply of ERC20 tokens in circulation.

### totalMintedTokenAndMinter

```solidity
function totalMintedTokenAndMinter(address minter) external view returns (uint256 totalMinted, uint256 minterMinted)
```

Returns the total number of tokens minted for the contract and the number of tokens minted by the `minter`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address to check for number of tokens minted |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| totalMinted | uint256 | total number of ERC20 tokens minted since token launch |
| minterMinted | uint256 | total number of ERC20 tokens minted by the `minter` |

### airdrop

```solidity
function airdrop(address[] recipients, uint256[] amounts) external
```

Mints tokens to the recipients in amounts specified

_This function should be protected by a role so that it is not callable by any address_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipients | address[] | addresses to airdrop tokens to |
| amounts | uint256[] | amount of tokens to airdrop to recipients |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

ERC165

## ERC721__IERC721Receiver

_Interface of ERC721 token receiver._

### onERC721Received

```solidity
function onERC721Received(address operator, address from, uint256 tokenId, bytes data) external returns (bytes4)
```

## ERC721

_Implementation of the [ERC721](https://eips.ethereum.org/EIPS/eip-721)
Non-Fungible Token Standard, including the Metadata extension.
Optimized for lower gas during batch mints.

Assumptions:

- An owner cannot have more than 2**64 - 1 (max value of uint64) of supply.
- The maximum token ID cannot exceed 2**256 - 1 (max value of uint256)._

### TokenApprovalRef

```solidity
struct TokenApprovalRef {
  address value;
}
```

### totalSupply

```solidity
function totalSupply() public view virtual returns (uint256)
```

_Returns the total number of tokens in existence.
Burned tokens will reduce the count.
To get the total number of tokens minted, please see {_totalMinted}._

### _totalMinted

```solidity
function _totalMinted() internal view virtual returns (uint256)
```

_Returns the total amount of tokens minted in the contract._

### _totalBurned

```solidity
function _totalBurned() internal view virtual returns (uint256)
```

_Returns the total number of tokens burned._

### balanceOf

```solidity
function balanceOf(address owner) public view virtual returns (uint256)
```

_Returns the number of tokens in `owner`'s account._

### _numberMinted

```solidity
function _numberMinted(address owner) internal view returns (uint256)
```

Returns the number of tokens minted by `owner`.

### _numberBurned

```solidity
function _numberBurned(address owner) internal view returns (uint256)
```

Returns the number of tokens burned by or on behalf of `owner`.

### _getAux

```solidity
function _getAux(address owner) internal view returns (uint64)
```

Returns the auxiliary data for `owner`. (e.g. number of whitelist mint slots used).

### _setAux

```solidity
function _setAux(address owner, uint64 aux) internal virtual
```

Sets the auxiliary data for `owner`. (e.g. number of whitelist mint slots used).
If there are multiple variables, please pack them into a uint64.

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_Returns true if this contract implements the interface defined by
`interfaceId`. See the corresponding
[EIP section](https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified)
to learn more about how these ids are created.

This function call must use less than 30000 gas._

### name

```solidity
function name() public view virtual returns (string)
```

_Returns the token collection name._

### symbol

```solidity
function symbol() public view virtual returns (string)
```

_Returns the token collection symbol._

### tokenURI

```solidity
function tokenURI(uint256 tokenId) public view virtual returns (string)
```

_Returns the Uniform Resource Identifier (URI) for `tokenId` token._

### _baseURI

```solidity
function _baseURI() internal view virtual returns (string)
```

_Base URI for computing {tokenURI}. If set, the resulting URI for each
token will be the concatenation of the `baseURI` and the `tokenId`. Empty
by default, it can be overridden in child contracts._

### ownerOf

```solidity
function ownerOf(uint256 tokenId) public view virtual returns (address)
```

_Returns the owner of the `tokenId` token.

Requirements:

- `tokenId` must exist._

### _ownershipOf

```solidity
function _ownershipOf(uint256 tokenId) internal view virtual returns (struct IERC721A.TokenOwnership)
```

_Gas spent here starts off proportional to the maximum mint batch size.
It gradually moves to O(1) as tokens get transferred around over time._

### _ownershipAt

```solidity
function _ownershipAt(uint256 index) internal view virtual returns (struct IERC721A.TokenOwnership)
```

_Returns the unpacked `TokenOwnership` struct at `index`._

### _ownershipIsInitialized

```solidity
function _ownershipIsInitialized(uint256 index) internal view virtual returns (bool)
```

_Returns whether the ownership slot at `index` is initialized.
An uninitialized slot does not necessarily mean that the slot has no owner._

### _initializeOwnershipAt

```solidity
function _initializeOwnershipAt(uint256 index) internal virtual
```

_Initializes the ownership slot minted at `index` for efficiency purposes._

### approve

```solidity
function approve(address to, uint256 tokenId) public payable virtual
```

_Gives permission to `to` to transfer `tokenId` token to another account. See {ERC721A-_approve}.

Requirements:

- The caller must own the token or be an approved operator._

### getApproved

```solidity
function getApproved(uint256 tokenId) public view virtual returns (address)
```

_Returns the account approved for `tokenId` token.

Requirements:

- `tokenId` must exist._

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) public virtual
```

_Approve or remove `operator` as an operator for the caller.
Operators can call {transferFrom} or {safeTransferFrom}
for any token owned by the caller.

Requirements:

- The `operator` cannot be the caller.

Emits an {ApprovalForAll} event._

### isApprovedForAll

```solidity
function isApprovedForAll(address owner, address operator) public view virtual returns (bool)
```

_Returns if the `operator` is allowed to manage all of the assets of `owner`.

See {setApprovalForAll}._

### _exists

```solidity
function _exists(uint256 tokenId) internal view virtual returns (bool result)
```

_Returns whether `tokenId` exists.

Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.

Tokens start existing when they are minted. See {_mint}._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) public payable virtual
```

_Transfers `tokenId` from `from` to `to`.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must be owned by `from`.
- If the caller is not `from`, it must be approved to move this token
by either {approve} or {setApprovalForAll}.

Emits a {Transfer} event._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) public payable virtual
```

_Equivalent to `safeTransferFrom(from, to, tokenId, '')`._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data) public payable virtual
```

_Safely transfers `tokenId` token from `from` to `to`.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must exist and be owned by `from`.
- If the caller is not `from`, it must be approved to move this token
by either {approve} or {setApprovalForAll}.
- If `to` refers to a smart contract, it must implement
{IERC721Receiver-onERC721Received}, which is called upon a safe transfer.

Emits a {Transfer} event._

### _beforeTokenTransfers

```solidity
function _beforeTokenTransfers(address from, address to, uint256 startTokenId, uint256 quantity) internal virtual
```

_Hook that is called before a set of serially-ordered token IDs
are about to be transferred. This includes minting.
And also called before burning one token.

`startTokenId` - the first token ID to be transferred.
`quantity` - the amount to be transferred.

Calling conditions:

- When `from` and `to` are both non-zero, `from`'s `tokenId` will be
transferred to `to`.
- When `from` is zero, `tokenId` will be minted for `to`.
- When `to` is zero, `tokenId` will be burned by `from`.
- `from` and `to` are never both zero._

### _afterTokenTransfers

```solidity
function _afterTokenTransfers(address from, address to, uint256 startTokenId, uint256 quantity) internal virtual
```

_Hook that is called after a set of serially-ordered token IDs
have been transferred. This includes minting.
And also called after one token has been burned.

`startTokenId` - the first token ID to be transferred.
`quantity` - the amount to be transferred.

Calling conditions:

- When `from` and `to` are both non-zero, `from`'s `tokenId` has been
transferred to `to`.
- When `from` is zero, `tokenId` has been minted for `to`.
- When `to` is zero, `tokenId` has been burned by `from`.
- `from` and `to` are never both zero._

### _mint

```solidity
function _mint(address minter, address to, uint256 tokenId) internal virtual
```

_Mints `quantity` tokens and transfers them to `to`.

Requirements:

- `to` cannot be the zero address.
- `quantity` must be greater than 0.

Emits a {Transfer} event for each mint._

### _safeMint

```solidity
function _safeMint(address minter, address to, uint256 tokenId, bytes _data) internal virtual
```

_Safely mints `quantity` tokens and transfers them to `to`.

Requirements:

- If `to` refers to a smart contract, it must implement
{IERC721Receiver-onERC721Received}, which is called for each safe transfer.
- `quantity` must be greater than 0.

See {_mint}.

Emits a {Transfer} event for each mint._

### _safeMint

```solidity
function _safeMint(address minter, address to, uint256 quantity) internal virtual
```

_Equivalent to `_safeMint(minter, to, quantity, '')`._

### _approve

```solidity
function _approve(address to, uint256 tokenId) internal virtual
```

_Equivalent to `_approve(to, tokenId, false)`._

### _approve

```solidity
function _approve(address to, uint256 tokenId, bool approvalCheck) internal virtual
```

_Gives permission to `to` to transfer `tokenId` token to another account.
The approval is cleared when the token is transferred.

Only a single account can be approved at a time, so approving the
zero address clears previous approvals.

Requirements:

- `tokenId` must exist.

Emits an {Approval} event._

### _burn

```solidity
function _burn(uint256 tokenId) internal virtual
```

_Equivalent to `_burn(tokenId, false)`._

### _burn

```solidity
function _burn(uint256 tokenId, bool approvalCheck) internal virtual
```

_Destroys `tokenId`.
The approval is cleared when the token is burned.

Requirements:

- `tokenId` must exist.

Emits a {Transfer} event._

### _setExtraDataAt

```solidity
function _setExtraDataAt(uint256 index, uint24 extraData) internal virtual
```

_Directly sets the extra data for the ownership data `index`._

### _extraData

```solidity
function _extraData(address from, address to, uint24 previousExtraData) internal view virtual returns (uint24)
```

_Called during each token transfer to set the 24bit `extraData` field.
Intended to be overridden by the cosumer contract.

`previousExtraData` - the value of `extraData` before transfer.

Calling conditions:

- When `from` and `to` are both non-zero, `from`'s `tokenId` will be
transferred to `to`.
- When `from` is zero, `tokenId` will be minted for `to`.
- When `to` is zero, `tokenId` will be burned by `from`.
- `from` and `to` are never both zero._

### _msgSenderERC721A

```solidity
function _msgSenderERC721A() internal view virtual returns (address)
```

_Returns the message sender (defaults to `msg.sender`).

If you are writing GSN compatible contracts, you need to override this function._

### _toString

```solidity
function _toString(uint256 value) internal pure virtual returns (string str)
```

_Converts a uint256 to its ASCII string decimal representation._

### _revert

```solidity
function _revert(bytes4 errorSelector) internal pure
```

_For more efficient reverts._

## Layerr721

Layerr721A is an ERC721 contract built for the Layerr platform using
        a modified Chiru Labs ERC721A implementation for non-sequential 
        minting.

### tokenURI

```solidity
function tokenURI(uint256 tokenId) public view virtual returns (string)
```

Returns the URI for a given `tokenId`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | id of token to return URI of |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | tokenURI location of the token metadata |

### contractURI

```solidity
function contractURI() public view returns (string)
```

Returns the URI for the contract metadata

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | contractURI location of the contract metadata |

### name

```solidity
function name() public view virtual returns (string)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | name the name of the token |

### symbol

```solidity
function symbol() public view virtual returns (string)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | symbol the token symbol |

### mintTokenId

```solidity
function mintTokenId(address minter, address to, uint256 tokenId) external
```

Mints `tokenId` to `to`.

_`minter` and `to` may be the same address but are passed as two separate parameters to properly account for
     allowlist mints where a minter is using a delegated wallet to mint_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address that the mint count will be credited to |
| to | address | address that will receive the token |
| tokenId | uint256 | the id of the token to mint |

### mintBatchTokenIds

```solidity
function mintBatchTokenIds(address minter, address to, uint256[] tokenIds) external
```

Mints `tokenIds` to `to`.

_`minter` and `to` may be the same address but are passed as two separate parameters to properly account for
     allowlist mints where a minter is using a delegated wallet to mint_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address that the mint count will be credited to |
| to | address | address that will receive the tokens |
| tokenIds | uint256[] | the ids of tokens to mint |

### burnTokenId

```solidity
function burnTokenId(address from, uint256 tokenId) external
```

Burns `tokenId` from `from` address

_This function should check that the caller has permission to burn tokens on behalf of `from`_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address to burn the tokenId from |
| tokenId | uint256 | id of token to be burned |

### burnBatchTokenIds

```solidity
function burnBatchTokenIds(address from, uint256[] tokenIds) external
```

Burns `tokenIds` from `from` address

_This function should check that the caller has permission to burn tokens on behalf of `from`_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address to burn the tokenIds from |
| tokenIds | uint256[] | ids of tokens to be burned |

### totalSupply

```solidity
function totalSupply() public view returns (uint256)
```

Returns the total supply of ERC721 tokens in circulation.

### totalMintedCollectionAndMinter

```solidity
function totalMintedCollectionAndMinter(address minter) external view returns (uint256 totalMinted, uint256 minterMinted)
```

Returns the total number of tokens minted for the contract and the number of tokens minted by the `minter`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address to check for number of tokens minted |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| totalMinted | uint256 | total number of ERC721 tokens minted since token launch |
| minterMinted | uint256 | total number of ERC721 tokens minted by the `minter` |

### airdrop

```solidity
function airdrop(address[] recipients, uint256[] tokenIds) external
```

Mints tokens to the recipients, each recipient gets the corresponding tokenId in the `tokenIds` array

_This function should be protected by a role so that it is not callable by any address_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipients | address[] | addresses to airdrop tokens to |
| tokenIds | uint256[] | ids of tokens to be airdropped to recipients |

### setOperatorFilter

```solidity
function setOperatorFilter(address operatorFilterRegistry) external
```

Subscribes to an operator filter registry

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operatorFilterRegistry | address | operator filter address to subscribe to |

### removeOperatorFilter

```solidity
function removeOperatorFilter() external
```

Unsubscribes from the operator filter registry

### updateMetadataAllTokens

```solidity
function updateMetadataAllTokens() external
```

Emits ERC-4906 BatchMetadataUpdate event for all tokens

### updateMetadataSpecificTokens

```solidity
function updateMetadataSpecificTokens(uint256[] tokenIds) external
```

Emits ERC-4906 MetadataUpdate event for tokens provided

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenIds | uint256[] | array of token ids to emit MetadataUpdate event for |

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) public
```

OPERATOR FILTER OVERRIDES

### approve

```solidity
function approve(address operator, uint256 tokenId) public payable
```

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) public payable
```

_Transfers `tokenId` from `from` to `to`.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must be owned by `from`.
- If the caller is not `from`, it must be approved to move this token
by either {approve} or {setApprovalForAll}.

Emits a {Transfer} event._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) public payable
```

_Equivalent to `safeTransferFrom(from, to, tokenId, '')`._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) public payable
```

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

ERC165

## ERC721A__IERC721Receiver

_Interface of ERC721 token receiver._

### onERC721Received

```solidity
function onERC721Received(address operator, address from, uint256 tokenId, bytes data) external returns (bytes4)
```

## ERC721A

_Implementation of the [ERC721](https://eips.ethereum.org/EIPS/eip-721)
Non-Fungible Token Standard, including the Metadata extension.
Optimized for lower gas during batch mints.

Token IDs are minted in sequential order (e.g. 0, 1, 2, 3, ...)
starting from `_startTokenId()`.

Assumptions:

- An owner cannot have more than 2**64 - 1 (max value of uint64) of supply.
- The maximum token ID cannot exceed 2**256 - 1 (max value of uint256)._

### TokenApprovalRef

```solidity
struct TokenApprovalRef {
  address value;
}
```

### _startTokenId

```solidity
function _startTokenId() internal view virtual returns (uint256)
```

_Returns the starting token ID.
To change the starting token ID, please override this function._

### _nextTokenId

```solidity
function _nextTokenId() internal view virtual returns (uint256)
```

_Returns the next token ID to be minted._

### totalSupply

```solidity
function totalSupply() public view virtual returns (uint256)
```

_Returns the total number of tokens in existence.
Burned tokens will reduce the count.
To get the total number of tokens minted, please see {_totalMinted}._

### _totalMinted

```solidity
function _totalMinted() internal view virtual returns (uint256)
```

_Returns the total amount of tokens minted in the contract._

### _totalBurned

```solidity
function _totalBurned() internal view virtual returns (uint256)
```

_Returns the total number of tokens burned._

### balanceOf

```solidity
function balanceOf(address owner) public view virtual returns (uint256)
```

_Returns the number of tokens in `owner`'s account._

### _numberMinted

```solidity
function _numberMinted(address owner) internal view returns (uint256)
```

Returns the number of tokens minted by `owner`.

### _numberBurned

```solidity
function _numberBurned(address owner) internal view returns (uint256)
```

Returns the number of tokens burned by or on behalf of `owner`.

### _getAux

```solidity
function _getAux(address owner) internal view returns (uint64)
```

Returns the auxiliary data for `owner`. (e.g. number of whitelist mint slots used).

### _setAux

```solidity
function _setAux(address owner, uint64 aux) internal virtual
```

Sets the auxiliary data for `owner`. (e.g. number of whitelist mint slots used).
If there are multiple variables, please pack them into a uint64.

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_Returns true if this contract implements the interface defined by
`interfaceId`. See the corresponding
[EIP section](https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified)
to learn more about how these ids are created.

This function call must use less than 30000 gas._

### name

```solidity
function name() public view virtual returns (string)
```

_Returns the token collection name._

### symbol

```solidity
function symbol() public view virtual returns (string)
```

_Returns the token collection symbol._

### tokenURI

```solidity
function tokenURI(uint256 tokenId) public view virtual returns (string)
```

_Returns the Uniform Resource Identifier (URI) for `tokenId` token._

### _baseURI

```solidity
function _baseURI() internal view virtual returns (string)
```

_Base URI for computing {tokenURI}. If set, the resulting URI for each
token will be the concatenation of the `baseURI` and the `tokenId`. Empty
by default, it can be overridden in child contracts._

### ownerOf

```solidity
function ownerOf(uint256 tokenId) public view virtual returns (address)
```

_Returns the owner of the `tokenId` token.

Requirements:

- `tokenId` must exist._

### _ownershipOf

```solidity
function _ownershipOf(uint256 tokenId) internal view virtual returns (struct IERC721A.TokenOwnership)
```

_Gas spent here starts off proportional to the maximum mint batch size.
It gradually moves to O(1) as tokens get transferred around over time._

### _ownershipAt

```solidity
function _ownershipAt(uint256 index) internal view virtual returns (struct IERC721A.TokenOwnership)
```

_Returns the unpacked `TokenOwnership` struct at `index`._

### _ownershipIsInitialized

```solidity
function _ownershipIsInitialized(uint256 index) internal view virtual returns (bool)
```

_Returns whether the ownership slot at `index` is initialized.
An uninitialized slot does not necessarily mean that the slot has no owner._

### _initializeOwnershipAt

```solidity
function _initializeOwnershipAt(uint256 index) internal virtual
```

_Initializes the ownership slot minted at `index` for efficiency purposes._

### approve

```solidity
function approve(address to, uint256 tokenId) public payable virtual
```

_Gives permission to `to` to transfer `tokenId` token to another account. See {ERC721A-_approve}.

Requirements:

- The caller must own the token or be an approved operator._

### getApproved

```solidity
function getApproved(uint256 tokenId) public view virtual returns (address)
```

_Returns the account approved for `tokenId` token.

Requirements:

- `tokenId` must exist._

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) public virtual
```

_Approve or remove `operator` as an operator for the caller.
Operators can call {transferFrom} or {safeTransferFrom}
for any token owned by the caller.

Requirements:

- The `operator` cannot be the caller.

Emits an {ApprovalForAll} event._

### isApprovedForAll

```solidity
function isApprovedForAll(address owner, address operator) public view virtual returns (bool)
```

_Returns if the `operator` is allowed to manage all of the assets of `owner`.

See {setApprovalForAll}._

### _exists

```solidity
function _exists(uint256 tokenId) internal view virtual returns (bool result)
```

_Returns whether `tokenId` exists.

Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.

Tokens start existing when they are minted. See {_mint}._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) public payable virtual
```

_Transfers `tokenId` from `from` to `to`.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must be owned by `from`.
- If the caller is not `from`, it must be approved to move this token
by either {approve} or {setApprovalForAll}.

Emits a {Transfer} event._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) public payable virtual
```

_Equivalent to `safeTransferFrom(from, to, tokenId, '')`._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data) public payable virtual
```

_Safely transfers `tokenId` token from `from` to `to`.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must exist and be owned by `from`.
- If the caller is not `from`, it must be approved to move this token
by either {approve} or {setApprovalForAll}.
- If `to` refers to a smart contract, it must implement
{IERC721Receiver-onERC721Received}, which is called upon a safe transfer.

Emits a {Transfer} event._

### _beforeTokenTransfers

```solidity
function _beforeTokenTransfers(address from, address to, uint256 startTokenId, uint256 quantity) internal virtual
```

_Hook that is called before a set of serially-ordered token IDs
are about to be transferred. This includes minting.
And also called before burning one token.

`startTokenId` - the first token ID to be transferred.
`quantity` - the amount to be transferred.

Calling conditions:

- When `from` and `to` are both non-zero, `from`'s `tokenId` will be
transferred to `to`.
- When `from` is zero, `tokenId` will be minted for `to`.
- When `to` is zero, `tokenId` will be burned by `from`.
- `from` and `to` are never both zero._

### _afterTokenTransfers

```solidity
function _afterTokenTransfers(address from, address to, uint256 startTokenId, uint256 quantity) internal virtual
```

_Hook that is called after a set of serially-ordered token IDs
have been transferred. This includes minting.
And also called after one token has been burned.

`startTokenId` - the first token ID to be transferred.
`quantity` - the amount to be transferred.

Calling conditions:

- When `from` and `to` are both non-zero, `from`'s `tokenId` has been
transferred to `to`.
- When `from` is zero, `tokenId` has been minted for `to`.
- When `to` is zero, `tokenId` has been burned by `from`.
- `from` and `to` are never both zero._

### _mint

```solidity
function _mint(address minter, address to, uint256 quantity) internal virtual
```

_Mints `quantity` tokens and transfers them to `to`.

Requirements:

- `to` cannot be the zero address.
- `quantity` must be greater than 0.

Emits a {Transfer} event for each mint._

### _mintERC2309

```solidity
function _mintERC2309(address to, uint256 quantity) internal virtual
```

_Mints `quantity` tokens and transfers them to `to`.

This function is intended for efficient minting only during contract creation.

It emits only one {ConsecutiveTransfer} as defined in
[ERC2309](https://eips.ethereum.org/EIPS/eip-2309),
instead of a sequence of {Transfer} event(s).

Calling this function outside of contract creation WILL make your contract
non-compliant with the ERC721 standard.
For full ERC721 compliance, substituting ERC721 {Transfer} event(s) with the ERC2309
{ConsecutiveTransfer} event is only permissible during contract creation.

Requirements:

- `to` cannot be the zero address.
- `quantity` must be greater than 0.

Emits a {ConsecutiveTransfer} event._

### _safeMint

```solidity
function _safeMint(address minter, address to, uint256 quantity, bytes _data) internal virtual
```

_Safely mints `quantity` tokens and transfers them to `to`.

Requirements:

- If `to` refers to a smart contract, it must implement
{IERC721Receiver-onERC721Received}, which is called for each safe transfer.
- `quantity` must be greater than 0.

See {_mint}.

Emits a {Transfer} event for each mint._

### _safeMint

```solidity
function _safeMint(address minter, address to, uint256 quantity) internal virtual
```

_Equivalent to `_safeMint(to, quantity, '')`._

### _approve

```solidity
function _approve(address to, uint256 tokenId) internal virtual
```

_Equivalent to `_approve(to, tokenId, false)`._

### _approve

```solidity
function _approve(address to, uint256 tokenId, bool approvalCheck) internal virtual
```

_Gives permission to `to` to transfer `tokenId` token to another account.
The approval is cleared when the token is transferred.

Only a single account can be approved at a time, so approving the
zero address clears previous approvals.

Requirements:

- `tokenId` must exist.

Emits an {Approval} event._

### _burn

```solidity
function _burn(uint256 tokenId) internal virtual
```

_Equivalent to `_burn(tokenId, false)`._

### _burn

```solidity
function _burn(uint256 tokenId, bool approvalCheck) internal virtual
```

_Destroys `tokenId`.
The approval is cleared when the token is burned.

Requirements:

- `tokenId` must exist.

Emits a {Transfer} event._

### _setExtraDataAt

```solidity
function _setExtraDataAt(uint256 index, uint24 extraData) internal virtual
```

_Directly sets the extra data for the ownership data `index`._

### _extraData

```solidity
function _extraData(address from, address to, uint24 previousExtraData) internal view virtual returns (uint24)
```

_Called during each token transfer to set the 24bit `extraData` field.
Intended to be overridden by the cosumer contract.

`previousExtraData` - the value of `extraData` before transfer.

Calling conditions:

- When `from` and `to` are both non-zero, `from`'s `tokenId` will be
transferred to `to`.
- When `from` is zero, `tokenId` will be minted for `to`.
- When `to` is zero, `tokenId` will be burned by `from`.
- `from` and `to` are never both zero._

### _msgSenderERC721A

```solidity
function _msgSenderERC721A() internal view virtual returns (address)
```

_Returns the message sender (defaults to `msg.sender`).

If you are writing GSN compatible contracts, you need to override this function._

### _toString

```solidity
function _toString(uint256 value) internal pure virtual returns (string str)
```

_Converts a uint256 to its ASCII string decimal representation._

### _revert

```solidity
function _revert(bytes4 errorSelector) internal pure
```

_For more efficient reverts._

## IERC721A

_Interface of ERC721A._

### ApprovalCallerNotOwnerNorApproved

```solidity
error ApprovalCallerNotOwnerNorApproved()
```

The caller must own the token or be an approved operator.

### ApprovalQueryForNonexistentToken

```solidity
error ApprovalQueryForNonexistentToken()
```

The token does not exist.

### BalanceQueryForZeroAddress

```solidity
error BalanceQueryForZeroAddress()
```

Cannot query the balance for the zero address.

### MintToZeroAddress

```solidity
error MintToZeroAddress()
```

Cannot mint to the zero address.

### MintZeroQuantity

```solidity
error MintZeroQuantity()
```

The quantity of tokens minted must be more than zero.

### OwnerQueryForNonexistentToken

```solidity
error OwnerQueryForNonexistentToken()
```

The token does not exist.

### TransferCallerNotOwnerNorApproved

```solidity
error TransferCallerNotOwnerNorApproved()
```

The caller must own the token or be an approved operator.

### TransferFromIncorrectOwner

```solidity
error TransferFromIncorrectOwner()
```

The token must be owned by `from`.

### TransferToNonERC721ReceiverImplementer

```solidity
error TransferToNonERC721ReceiverImplementer()
```

Cannot safely transfer to a contract that does not implement the
ERC721Receiver interface.

### TransferToZeroAddress

```solidity
error TransferToZeroAddress()
```

Cannot transfer to the zero address.

### URIQueryForNonexistentToken

```solidity
error URIQueryForNonexistentToken()
```

The token does not exist.

### MintERC2309QuantityExceedsLimit

```solidity
error MintERC2309QuantityExceedsLimit()
```

The `quantity` minted with ERC2309 exceeds the safety limit.

### OwnershipNotInitializedForExtraData

```solidity
error OwnershipNotInitializedForExtraData()
```

The `extraData` cannot be set on an unintialized ownership slot.

### TokenAlreadyExists

```solidity
error TokenAlreadyExists()
```

Cannot mint a token that already exists.

### TokenOwnership

```solidity
struct TokenOwnership {
  address addr;
  uint64 startTimestamp;
  bool burned;
  uint24 extraData;
}
```

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

_Returns the total number of tokens in existence.
Burned tokens will reduce the count.
To get the total number of tokens minted, please see {_totalMinted}._

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```

_Returns true if this contract implements the interface defined by
`interfaceId`. See the corresponding
[EIP section](https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified)
to learn more about how these ids are created.

This function call must use less than 30000 gas._

### Transfer

```solidity
event Transfer(address from, address to, uint256 tokenId)
```

_Emitted when `tokenId` token is transferred from `from` to `to`._

### Approval

```solidity
event Approval(address owner, address approved, uint256 tokenId)
```

_Emitted when `owner` enables `approved` to manage the `tokenId` token._

### ApprovalForAll

```solidity
event ApprovalForAll(address owner, address operator, bool approved)
```

_Emitted when `owner` enables or disables
(`approved`) `operator` to manage all of its assets._

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256 balance)
```

_Returns the number of tokens in `owner`'s account._

### ownerOf

```solidity
function ownerOf(uint256 tokenId) external view returns (address owner)
```

_Returns the owner of the `tokenId` token.

Requirements:

- `tokenId` must exist._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) external payable
```

_Safely transfers `tokenId` token from `from` to `to`,
checking first that contract recipients are aware of the ERC721 protocol
to prevent tokens from being forever locked.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must exist and be owned by `from`.
- If the caller is not `from`, it must be have been allowed to move
this token by either {approve} or {setApprovalForAll}.
- If `to` refers to a smart contract, it must implement
{IERC721Receiver-onERC721Received}, which is called upon a safe transfer.

Emits a {Transfer} event._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) external payable
```

_Equivalent to `safeTransferFrom(from, to, tokenId, '')`._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) external payable
```

_Transfers `tokenId` from `from` to `to`.

WARNING: Usage of this method is discouraged, use {safeTransferFrom}
whenever possible.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must be owned by `from`.
- If the caller is not `from`, it must be approved to move this token
by either {approve} or {setApprovalForAll}.

Emits a {Transfer} event._

### approve

```solidity
function approve(address to, uint256 tokenId) external payable
```

_Gives permission to `to` to transfer `tokenId` token to another account.
The approval is cleared when the token is transferred.

Only a single account can be approved at a time, so approving the
zero address clears previous approvals.

Requirements:

- The caller must own the token or be an approved operator.
- `tokenId` must exist.

Emits an {Approval} event._

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool _approved) external
```

_Approve or remove `operator` as an operator for the caller.
Operators can call {transferFrom} or {safeTransferFrom}
for any token owned by the caller.

Requirements:

- The `operator` cannot be the caller.

Emits an {ApprovalForAll} event._

### getApproved

```solidity
function getApproved(uint256 tokenId) external view returns (address operator)
```

_Returns the account approved for `tokenId` token.

Requirements:

- `tokenId` must exist._

### isApprovedForAll

```solidity
function isApprovedForAll(address owner, address operator) external view returns (bool)
```

_Returns if the `operator` is allowed to manage all of the assets of `owner`.

See {setApprovalForAll}._

### name

```solidity
function name() external view returns (string)
```

_Returns the token collection name._

### symbol

```solidity
function symbol() external view returns (string)
```

_Returns the token collection symbol._

### tokenURI

```solidity
function tokenURI(uint256 tokenId) external view returns (string)
```

_Returns the Uniform Resource Identifier (URI) for `tokenId` token._

### ConsecutiveTransfer

```solidity
event ConsecutiveTransfer(uint256 fromTokenId, uint256 toTokenId, address from, address to)
```

_Emitted when tokens in `fromTokenId` to `toTokenId`
(inclusive) is transferred from `from` to `to`, as defined in the
[ERC2309](https://eips.ethereum.org/EIPS/eip-2309) standard.

See {_mintERC2309} for more details._

## Layerr721A

Layerr721A is an ERC721 contract built for the Layerr platform using
        the Chiru Labs ERC721A implementation for gas efficient sequential 
        minting.

### tokenURI

```solidity
function tokenURI(uint256 tokenId) public view virtual returns (string)
```

Returns the URI for a given `tokenId`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | id of token to return URI of |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | tokenURI location of the token metadata |

### contractURI

```solidity
function contractURI() public view returns (string)
```

Returns the URI for the contract metadata

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | contractURI location of the contract metadata |

### name

```solidity
function name() public view virtual returns (string)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | name the name of the token |

### symbol

```solidity
function symbol() public view virtual returns (string)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | symbol the token symbol |

### mintSequential

```solidity
function mintSequential(address minter, address to, uint256 quantity) external
```

Sequentially mints `quantity` of tokens to `to`

_`minter` and `to` may be the same address but are passed as two separate parameters to properly account for
     allowlist mints where a minter is using a delegated wallet to mint_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address that the mint count will be credited to |
| to | address | address that will receive the tokens |
| quantity | uint256 | the number of tokens to sequentially mint to `to` |

### burnTokenId

```solidity
function burnTokenId(address from, uint256 tokenId) external
```

Burns `tokenId` from `from` address

_This function should check that the caller has permission to burn tokens on behalf of `from`_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address to burn the tokenId from |
| tokenId | uint256 | id of token to be burned |

### burnBatchTokenIds

```solidity
function burnBatchTokenIds(address from, uint256[] tokenIds) external
```

Burns `tokenIds` from `from` address

_This function should check that the caller has permission to burn tokens on behalf of `from`_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address to burn the tokenIds from |
| tokenIds | uint256[] | ids of tokens to be burned |

### totalSupply

```solidity
function totalSupply() public view returns (uint256)
```

Returns the total supply of ERC721 tokens in circulation.

### totalMintedCollectionAndMinter

```solidity
function totalMintedCollectionAndMinter(address minter) external view returns (uint256 totalMinted, uint256 minterMinted)
```

Returns the total number of tokens minted for the contract and the number of tokens minted by the `minter`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | address to check for number of tokens minted |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| totalMinted | uint256 | total number of ERC721 tokens minted since token launch |
| minterMinted | uint256 | total number of ERC721 tokens minted by the `minter` |

### airdrop

```solidity
function airdrop(address[] recipients, uint256[] amounts) external
```

Mints tokens to the recipients, each recipient receives the corresponding amount of tokens in the `amounts` array

_This function should be protected by a role so that it is not callable by any address_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipients | address[] | addresses to airdrop tokens to |
| amounts | uint256[] | amount of tokens that should be airdropped to each recipient |

### setOperatorFilter

```solidity
function setOperatorFilter(address operatorFilterRegistry) external
```

Subscribes to an operator filter registry

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operatorFilterRegistry | address | operator filter address to subscribe to |

### removeOperatorFilter

```solidity
function removeOperatorFilter() external
```

Unsubscribes from the operator filter registry

### updateMetadataAllTokens

```solidity
function updateMetadataAllTokens() external
```

Emits ERC-4906 BatchMetadataUpdate event for all tokens

### updateMetadataSpecificTokens

```solidity
function updateMetadataSpecificTokens(uint256[] tokenIds) external
```

Emits ERC-4906 MetadataUpdate event for tokens provided

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenIds | uint256[] | array of token ids to emit MetadataUpdate event for |

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) public
```

OPERATOR FILTER OVERRIDES

### approve

```solidity
function approve(address operator, uint256 tokenId) public payable
```

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) public payable
```

_Transfers `tokenId` from `from` to `to`.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must be owned by `from`.
- If the caller is not `from`, it must be approved to move this token
by either {approve} or {setApprovalForAll}.

Emits a {Transfer} event._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) public payable
```

_Equivalent to `safeTransferFrom(from, to, tokenId, '')`._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) public payable
```

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

ERC165

## LayerrToken

LayerrToken contains the general purpose token contract functions for interacting
        with the Layerr platform.

### mintingExtensions

```solidity
mapping(address => bool) mintingExtensions
```

_mapping of allowed mint extensions_

### onlyMinter

```solidity
modifier onlyMinter()
```

### name

```solidity
function name() public view virtual returns (string _name)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| _name | string | name the name of the token |

### symbol

```solidity
function symbol() public view virtual returns (string _symbol)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| _symbol | string | symbol the token symbol |

### renderer

```solidity
function renderer() external view returns (address _renderer)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| _renderer | address | renderer the address that will render token/contract URIs |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

### setRenderer

```solidity
function setRenderer(address _renderer) external
```

Sets the renderer for token/contract URIs

_This function should be restricted to contract owners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _renderer | address | address to set as the token/contract URI renderer |

### setMintExtension

```solidity
function setMintExtension(address _extension, bool _allowed) external
```

Sets whether or not an address is allowed to call minting functions

_This function should be restricted to contract owners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _extension | address | address of the mint extension to update |
| _allowed | bool | if the mint extension is allowed to mint tokens |

### setContractAllowedSigner

```solidity
function setContractAllowedSigner(address _extension, address _signer, bool _allowed) external
```

This function calls the mint extension to update `_signer`'s allowance

_This function should be restricted to contract owners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _extension | address | address of the mint extension to update |
| _signer | address | address of the signer to update |
| _allowed | bool | if `_signer` is allowed to sign for `_extension` |

### setContractAllowedOracle

```solidity
function setContractAllowedOracle(address _extension, address _oracle, bool _allowed) external
```

This function calls the mint extension to update `_oracle`'s allowance

_This function should be restricted to contract owners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _extension | address | address of the mint extension to update |
| _oracle | address | address of the oracle to update |
| _allowed | bool | if `_oracle` is allowed to sign for `_extension` |

### setSignatureValidity

```solidity
function setSignatureValidity(address _extension, bytes32[] signatureDigests, bool invalid) external
```

This function calls the mint extension to update signature validity

_This function should be restricted to contract owners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _extension | address | address of the mint extension to update |
| signatureDigests | bytes32[] | hash digests of signatures parameters to update |
| invalid | bool | true if the signature digests should be marked as invalid |

### setRoyalty

```solidity
function setRoyalty(uint96 pct, address royaltyReciever) external
```

This function updates the ERC2981 royalty percentages

_This function should be restricted to contract owners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| pct | uint96 | royalty percentage in BPS |
| royaltyReciever | address | address to receive royalties |

### editContract

```solidity
function editContract(string _name, string _symbol) external
```

This function updates the token contract's name and symbol

_This function should be restricted to contract owners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _name | string | new name for the token contract |
| _symbol | string | new symbol for the token contract |

### initialize

```solidity
function initialize() external
```

Called during a proxy deployment to emit the LayerrContractDeployed event

### withdraw

```solidity
function withdraw() external
```

Called to withdraw any funds that may be sent to the contract

### _setRenderer

```solidity
function _setRenderer(address _renderer) internal
```

Internal function to set the renderer address in a custom storage slot location

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _renderer | address | address of the renderer to set |

### _getRenderer

```solidity
function _getRenderer() internal view returns (address _renderer)
```

Internal function to get the renderer address from a custom storage slot location

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| _renderer | address | address of the renderer |

### _setName

```solidity
function _setName(string _name) internal
```

Internal function to set the token contract name in a custom storage slot location

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _name | string | name for the token contract |

### _setSymbol

```solidity
function _setSymbol(string _symbol) internal
```

Internal function to set the token contract symbol in a custom storage slot location

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _symbol | string | symbol for the token contract |

