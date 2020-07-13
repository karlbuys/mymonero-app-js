"use strict"

const JSBigInt = require('../../mymonero_libapp_js/mymonero-core-js/cryptonote_utils/biginteger').BigInteger

class Transaction {

    hash;
    txKey;
    mixin;
    totalReceived;
    totalSent;
    unlockTime;
    timestamp;
    spentOutputs;
    paymentId;

    constructor(transaction) {
        this.tx = transaction
        this.hash = transaction.hash
        this.txKey = transaction.tx_key
        this.mixin = transaction.mixin
        this.totalReceived = transaction.total_received
        this.totalSent = transaction.total_sent
        this.unlockTime = transaction.unlock_time
        this.timestamp = transaction.timestamp
        this.spentOutputs = transaction.spent_outputs
        this.paymentId = transaction.payment_id || ""
    }

    // returns a JSBigInt of the tx's received amount
    received() {
        return this.totalReceived ? (typeof this.totalReceived == 'string' ? new JSBigInt(this.totalReceived) : this.totalReceived) : new JSBigInt("0")
    }

    // returns a JSBigInt of the tx's sent amount
    sent() {
        return this.totalSent ? (typeof this.totalSent == 'string' ? new JSBigInt(this.totalSent) : this.totalSent) : new JSBigInt("0")
    }

    // signed total of sent and received
    total() {
        return this.received().subtract(this.sent())
    }

    isNegative() {
        return this.total() < 0
    }

    isLocked() {
        return this.tx.isLocked()
    }

    isConfirmed() {
        return this.tx.isConfirmed()
    }

    hasFailed() {
        return this.tx.isFailed()
    }

    wasJustSent() {
        return this.tx.isJustSentTransaction()
    }

    status() {
        return this.tx.isFailed ? "REJECTED" : (this.tx.isConfirmed !== true || this.tx.isUnlocked !== true ? "PENDING" : "CONFIRMED")
    }

    ringSize() {
        return parseInt(this.mixin + 1);
    }

    shortFormatDate() {
        const date = this.timestamp
        return date.toLocaleDateString( // (e.g. 27 NOV 2016)
            'en-US'/*for now*/,
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        ).toUpperCase()
    }

    fullFormatDate() {
        const date = this.timestamp

        return date.toLocaleDateString(
            'en-US'/*for now*/,
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
            }
        ).toUpperCase()
    }
}

module.exports = Transaction