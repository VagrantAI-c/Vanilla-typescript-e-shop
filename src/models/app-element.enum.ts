/** 
 * Provides registry of available elements throughout the app.
 * Every specified attribute selector should be present in DOM.
 */
export enum AppElement {
    MASONRY_CONTAINER = 'masonryContainer',

    // Cart related attributes
    CART_ITEMS_CONTAINER = 'cartItemsContainer',
    CART_SIDEBAR = 'cartSidebar',
    CART_SUMMARY_LABEL = 'cartSummaryLabel',
    CART_QUANTITY_LABEL = 'cartQuantityLabel',

    // Cart item related attributes
    CART_ITEM_TEMPLATE = 'cartItem',
    CART_ITEM_WRAPPER = 'cartItemWrapper',
    CART_ITEM_IMAGE = 'cartItemImage',
    CART_ITEM_NAME_LABEL = 'cartItemNameLabel',
    CART_ITEM_PRICE_LABEL = 'cartItemPriceLabel',
    CART_ITEM_REMOVE_BUTTON = 'cartItemRemoveButton',

    // Vehicle card related attributes
    VEHICLE_CARD_TEMPLATE = 'vehicleCard',
    VEHICLE_CARD_PURCHASE_BUTTON = 'vehicleCardPurchaseButton',
    VEHICLE_CARD_IMAGE = 'vehicleCardImage',
    VEHICLE_CARD_NAME_LABEL = 'vehicleCardNameLabel',
    VEHICLE_CARD_PRICE_LABEL = 'vehicleCardPriceLabel',
}
