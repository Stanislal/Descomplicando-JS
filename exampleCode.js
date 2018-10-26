$.Topic("CUSTOM_CHECKOUT_ADDRESS_BOOK.memory").subscribe(function (address) {
    shipping = address.selectedAddress();
    var selectedShippmentOptions = address.selectedAddress().shippmentOptions;
    self.mockShipping(shipping.shippmentOptions);

    var list = {};
    var item;
    var partner;
    var cart = address.cart().items();
    for (item in cart) {
        var partner = cart[item].productData().childSKUs[0].v_parceiro;

        if (!list[partner]) {
            list[partner] = { products: [] };
            list[partner].totalAmount = 0;
            $.each(selectedShippmentOptions, function (idx, elm) {
                if (elm.partnerCode == partner ){
                    list[partner].freight = elm.price;
                }
            });
            list[partner].onlyPriceInstallment = Math.abs(parseFloat((data.installmentOptions[partner][0].amount - list[partner].freight).toFixed(2)));
            list[partner].accrual = data.installmentOptions[partner][0].accrual;
            list[partner].installmentPrice = data.installmentOptions[partner][0].amount;
            list[partner].differenceAmount = 0;
        }
        list[partner].products.push({
            name: cart[item].productData().displayName,
            partner: cart[item].productData().childSKUs[0].s_partner_id,
            partnerId: cart[item].productData().childSKUs[0].v_parceiro,
            quantity: cart[item].quantity(),
            amount: cart[item].itemTotal(),
            priceUnit: cart[item].externalPrice()
        });
    }
    $.each(list, function (idx, elm) {
        $.each(elm.products, function (index, element) {
            elm.totalAmount += element.amount;
        })
        elm.differenceAmount = elm.totalAmount - elm.onlyPriceInstallment;
        elm.differenceAmount = parseFloat(elm.differenceAmount.toFixed(2));
    });

    self.partnerSettings(list);
});