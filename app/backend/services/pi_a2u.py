"""Pi A2U (App-to-User) payment service using Stellar SDK."""
import os
import logging
import asyncio
from typing import List, Dict, Any
from stellar_sdk import Server, Keypair, TransactionBuilder, Network, Payment
from stellar_sdk.exceptions import NotFoundError, BadResponseError

logger = logging.getLogger(__name__)

# Pi Testnet configuration
PI_TESTNET_HORIZON = "https://api.testnet.minepi.com"
PI_TESTNET_PASSPHRASE = "Pi Testnet"

async def send_a2u_payments(destinations: List[str], amount: str = "0.01", memo: str = "Atlasphere A2U test") -> List[Dict[str, Any]]:
    """
    Send Pi from the app wallet to multiple destinations.
    Returns a list of results (success or error) for each destination.
    """
    secret = os.getenv("PI_WALLET_SECRET")
    if not secret:
        raise ValueError("PI_WALLET_SECRET environment variable is not set")

    source_keypair = Keypair.from_secret(secret)
    source_public = source_keypair.public_key
    server = Server(horizon_url=PI_TESTNET_HORIZON)

    results = []
    for dest in destinations:
        try:
            # Load source account
            source_account = await asyncio.to_thread(server.load_account, source_public)
            # Build transaction
            base_fee = await asyncio.to_thread(server.fetch_base_fee)
            transaction = (
                TransactionBuilder(
                    source_account=source_account,
                    network_passphrase=PI_TESTNET_PASSPHRASE,
                    base_fee=base_fee,
                )
                .add_text_memo(memo)
                .append_payment_op(
                    destination=dest,
                    amount=amount,
                    asset_code="Pi",
                    asset_issuer=None,  # Pi is native
                )
                .set_timeout(30)
                .build()
            )
            transaction.sign(source_keypair)
            response = await asyncio.to_thread(server.submit_transaction, transaction)
            results.append({"destination": dest, "status": "success", "hash": response["hash"]})
            logger.info(f"A2U payment sent to {dest}: {response['hash']}")
        except Exception as e:
            logger.error(f"A2U payment failed to {dest}: {str(e)}")
            results.append({"destination": dest, "status": "error", "error": str(e)})
    return results
