var app = (function (exports) {
    'use strict';

    class Vehicle {
        constructor(imageUrl, 
        /** Also used as entity id */
        label, price) {
            this.imageUrl = imageUrl;
            this.label = label;
            this.price = price;
        }
    }

    const VEHICLES = [
        new Vehicle(generatePlaceholder(), 'Ferrari', 500000),
        new Vehicle(generatePlaceholder(), 'Lamborghini', 499000),
        new Vehicle(generatePlaceholder(), 'Kawasaki', 100000),
        new Vehicle(generatePlaceholder(), 'Samurai', 99000),
        new Vehicle(generatePlaceholder(), 'Gucci', 5000),
        new Vehicle(generatePlaceholder(), 'Tesla', 10000),
        new Vehicle(generatePlaceholder(), 'Boeing', 1000000),
        new Vehicle(generatePlaceholder(), 'S7', 900000),
    ];
    function generatePlaceholder() {
        return `https://via.placeholder.com/${getRandomWidth()}`;
    }
    function getRandomWidth() {
        return Math.floor(Math.random() * 600 + 400);
    }

    class CartStoreService {
        constructor() {
            this.listeners = new Set();
            this.items = new Map();
        }
        add(item) {
            this.items.set(item.label, item);
            this.emit();
        }
        remove(item) {
            this.items.delete(item.label);
            this.emit();
        }
        clear() {
            this.items.clear();
            this.emit();
        }
        /**
         * Listens to item changes via provided callback
         *
         * @returns unlisten callback
         */
        listen(callbackFn) {
            this.listeners.add(callbackFn);
            callbackFn(this.getItems());
        }
        emit() {
            const items = this.getItems();
            Array.from(this.listeners)
                .forEach((callbackFn) => {
                callbackFn(items);
            });
        }
        getItems() {
            return Array.from(this.items.values());
        }
    }

    function beautifyPrice(price) {
        const priceArray = [...`${price}`];
        const lastIndex = priceArray.length - 1;
        const priceString = priceArray
            .map((value, index) => 
        // Next expression returns true for every third element from beginning,
        // except the last one
        index !== lastIndex && (lastIndex - index) % 3 === 0
            ? `${value},`
            : value)
            .join(''); // 1234567 -> '1,234,567'
        return `${priceString}$`;
    }

    function select(target, container) {
        const element = (container || document).querySelector(`[${target}]`);
        if (!element) {
            throw new Error(`Expected "[${target}]" to be available in DOM`);
        }
        return element;
    }

    /**
     * Provides registry of available elements throughout the app.
     * Every specified attribute selector should be present in DOM.
     */
    var AppElement;
    (function (AppElement) {
        AppElement["MASONRY_CONTAINER"] = "masonryContainer";
        // Cart related attributes
        AppElement["CART_ITEMS_CONTAINER"] = "cartItemsContainer";
        AppElement["CART_SIDEBAR"] = "cartSidebar";
        AppElement["CART_SUMMARY_LABEL"] = "cartSummaryLabel";
        AppElement["CART_QUANTITY_LABEL"] = "cartQuantityLabel";
        // Cart item related attributes
        AppElement["CART_ITEM_TEMPLATE"] = "cartItem";
        AppElement["CART_ITEM_WRAPPER"] = "cartItemWrapper";
        AppElement["CART_ITEM_IMAGE"] = "cartItemImage";
        AppElement["CART_ITEM_NAME_LABEL"] = "cartItemNameLabel";
        AppElement["CART_ITEM_PRICE_LABEL"] = "cartItemPriceLabel";
        AppElement["CART_ITEM_REMOVE_BUTTON"] = "cartItemRemoveButton";
        // Vehicle card related attributes
        AppElement["VEHICLE_CARD_TEMPLATE"] = "vehicleCard";
        AppElement["VEHICLE_CARD_PURCHASE_BUTTON"] = "vehicleCardPurchaseButton";
        AppElement["VEHICLE_CARD_IMAGE"] = "vehicleCardImage";
        AppElement["VEHICLE_CARD_NAME_LABEL"] = "vehicleCardNameLabel";
        AppElement["VEHICLE_CARD_PRICE_LABEL"] = "vehicleCardPriceLabel";
    })(AppElement || (AppElement = {}));

    class VehicleCardComponent {
        constructor(cartStore) {
            this.cartStore = cartStore;
        }
        render(item, container) {
            const templateRef = select(AppElement.VEHICLE_CARD_TEMPLATE).content.cloneNode(true);
            select(AppElement.VEHICLE_CARD_IMAGE, templateRef).setAttribute('src', item.imageUrl);
            select(AppElement.VEHICLE_CARD_NAME_LABEL, templateRef).textContent = item.label;
            select(AppElement.VEHICLE_CARD_PRICE_LABEL, templateRef).textContent = beautifyPrice(item.price);
            select(AppElement.VEHICLE_CARD_PURCHASE_BUTTON, templateRef).addEventListener('click', this.purchase.bind(this, item));
            container.appendChild(templateRef);
        }
        purchase(item) {
            this.cartStore.add(item);
        }
    }

    class CartItemComponent {
        constructor(item, cartStore) {
            this.item = item;
            this.cartStore = cartStore;
            this.containerElementRef = null;
            this.boundEmitRemoveFn = this.emitRemove.bind(this, this.item);
        }
        render(container) {
            const containerElementRef = select(AppElement.CART_ITEM_TEMPLATE).content.cloneNode(true);
            this.containerElementRef = select(AppElement.CART_ITEM_WRAPPER, containerElementRef);
            select(AppElement.CART_ITEM_IMAGE, containerElementRef).setAttribute('src', this.item.imageUrl);
            select(AppElement.CART_ITEM_NAME_LABEL, containerElementRef).textContent = this.item.label;
            select(AppElement.CART_ITEM_PRICE_LABEL, containerElementRef).textContent = beautifyPrice(this.item.price);
            select(AppElement.CART_ITEM_REMOVE_BUTTON, containerElementRef).addEventListener('click', this.boundEmitRemoveFn);
            container.appendChild(containerElementRef);
        }
        detach() {
            if (this.containerElementRef) {
                select(AppElement.CART_ITEM_REMOVE_BUTTON, this.containerElementRef).removeEventListener('click', this.boundEmitRemoveFn);
                this.containerElementRef.remove();
            }
        }
        emitRemove(item) {
            this.cartStore.remove(item);
        }
    }

    const cartStore = new CartStoreService();
    const cartItems = [];
    renderMasonry();
    listenCartChanges();
    function renderMasonry() {
        const masonryContainer = select(AppElement.MASONRY_CONTAINER);
        VEHICLES.forEach((item) => {
            const itemCard = new VehicleCardComponent(cartStore);
            itemCard.render(item, masonryContainer);
        });
    }
    function listenCartChanges() {
        cartStore.listen((items) => renderCartItems(items));
    }
    function renderCartItems(items) {
        // Remove existing cart items
        cartItems.forEach((item) => item.detach());
        cartItems.splice(0, cartItems.length);
        // Add new items and update corresponding labels
        let cartSum = 0;
        const container = select(AppElement.CART_ITEMS_CONTAINER);
        items.forEach((item) => {
            cartSum += item.price;
            const cartItem = new CartItemComponent(item, cartStore);
            cartItem.render(container);
            cartItems.push(cartItem);
        });
        select(AppElement.CART_QUANTITY_LABEL).textContent = `(${items.length} item${items.length === 1 ? 's' : ''})`;
        select(AppElement.CART_SUMMARY_LABEL).textContent = beautifyPrice(cartSum);
    }
    function toggleSidebar() {
        select(AppElement.CART_SIDEBAR).classList.toggle('opened');
    }
    function clearCart() {
        cartStore.clear();
    }

    exports.clearCart = clearCart;
    exports.toggleSidebar = toggleSidebar;

    return exports;

}({}));
