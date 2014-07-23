/*
 * Simple class that loads the address list and performs some cleanup on it.
 * Requires an array of Strings for construction.
 */
function AddressList(addressList) {
    if (addressList && addressList instanceof Array) {
        this.addressList = addressList
            // some entries have quotes; remove them, clear up any excess whitespace
            .map(function (address) {
                return address.replace(/\"/g, '').trim();
            });

    } else {
        this.addressList = [];
    }
}

AddressList.prototype.getAddressList = function() {
    return this.addressList;
}

module.exports = AddressList;