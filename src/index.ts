import './index.scss';
import { VEHICLES } from './models/vehicles.const';
import { CartStoreService } from './services/cart-store.service';
import { Vehicle } from './models/vehicle.model';
import { VehicleCardComponent } from './services/vehice-card.component';
import { select } from './helpers/select';
import { AppElement } from './models/app-element.enum';
import { CartItemComponent } from './services/cart-item.component';
import { beautifyPrice } from './helpers/beautify-price';

const cartStore = new CartStoreService();
const cartItems: CartItemComponent[] = [];

renderMasonry();
listenCartChanges();

function renderMasonry(): void {
    const masonryContainer = select(AppElement.MASONRY_CONTAINER);
    VEHICLES.forEach((item: Vehicle) => {
        const itemCard = new VehicleCardComponent(cartStore);
        itemCard.render(item, masonryContainer);
    });
}

function listenCartChanges(): void {
    cartStore.listen((items: Vehicle[]) => renderCartItems(items));
}

function renderCartItems(items: Vehicle[]): void {
    // Remove existing cart items
    cartItems.forEach((item: CartItemComponent) => item.detach());
    cartItems.splice(0, cartItems.length);

    // Add new items and update corresponding labels
    let cartSum = 0;
    const container = select(AppElement.CART_ITEMS_CONTAINER);
    items.forEach((item: Vehicle) => {
        cartSum += item.price;
        const cartItem = new CartItemComponent(item, cartStore);
        cartItem.render(container);
        cartItems.push(cartItem);
    });
    select(AppElement.CART_QUANTITY_LABEL).textContent = `(${items.length} item${items.length === 1 ? '' : 's'})`;
    select(AppElement.CART_SUMMARY_LABEL).textContent = beautifyPrice(cartSum);
}

export function toggleSidebar(): void {
    select(AppElement.CART_SIDEBAR).classList.toggle('opened');
}

export function clearCart(): void {
    cartStore.clear();
}