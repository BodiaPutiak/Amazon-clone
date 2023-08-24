export function formatCurrency(priceCents) {
    return (priceCents / 100).toFixed(2);
};


export function calculateTax(price, shipping) {
    if (typeof price !== 'number' || typeof shipping !== 'number') {
        console.error('Invalid input: price and shipping must be numbers.');
        return NaN;
    }
    
    const tax = ((price + shipping) * 0.1).toFixed(2);
    return parseFloat(tax).toFixed(2); // Parse the result to ensure it's a number
}

export function calculateShippingCost(optionValue) {
    switch (optionValue) {
        case 'free':
            return 0;
        case 'five':
            return 499;
        case 'ten':
            return 999;
        default:
            return 0;
    }
}