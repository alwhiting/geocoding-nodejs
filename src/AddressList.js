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
            })
            // the address list contains 'Address' as the first line, I felt like it
            // would be cheating to just remove that so this filter is used to make
            // a quasi-intelligent effort to remove non-address elements
            .filter(function (address) {
                return address.length > 0 && !isNaN(parseInt(address[0], 10));
            });

    } else {
        this.addressList = [];
    }
}

AddressList.prototype.getAddressList = function() {
    return this.addressList;
}

module.exports = AddressList;