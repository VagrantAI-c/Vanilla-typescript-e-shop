export function beautifyPrice(price: number): string {
    const priceArray = [...`${price}`];
    const lastIndex = priceArray.length - 1;
    const priceString = priceArray
        .map((value: string, index: number) => 
            // Next expression returns true for every third element from beginning,
            // except the last one
            index !== lastIndex && (lastIndex - index) % 3 === 0
                ? `${value},`
                : value
        )
        .join(''); // 1234567 -> '1,234,567'

    return `${priceString}$`;
}