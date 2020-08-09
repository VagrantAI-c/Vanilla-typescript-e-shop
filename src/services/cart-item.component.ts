import { beautifyPrice } from '../helpers/beautify-price';
import { select } from '../helpers/select';
import { AppElement } from '../models/app-element.enum';
import { Vehicle } from '../models/vehicle.model';
import { CartStoreService } from './cart-store.service';

export class CartItemComponent {

    private containerElementRef: HTMLElement | null = null;
    private readonly boundEmitRemoveFn = this.emitRemove.bind(this, this.item);

    constructor(
        private item: Vehicle,
        private cartStore: CartStoreService,
    ) {
    }

    public render(container: HTMLElement): void {
        const containerElementRef = select(AppElement.CART_ITEM_TEMPLATE).content.cloneNode(true) as HTMLElement;
        this.containerElementRef = select(AppElement.CART_ITEM_WRAPPER, containerElementRef);
        select(AppElement.CART_ITEM_IMAGE, containerElementRef).setAttribute('src', this.item.imageUrl);
        select(AppElement.CART_ITEM_NAME_LABEL, containerElementRef).textContent = this.item.label;
        select(AppElement.CART_ITEM_PRICE_LABEL, containerElementRef).textContent = beautifyPrice(this.item.price);
        select(AppElement.CART_ITEM_REMOVE_BUTTON, containerElementRef).addEventListener('click', this.boundEmitRemoveFn);
        container.appendChild(containerElementRef);
    }

    public detach(): void { 
        if (this.containerElementRef) {
            select(AppElement.CART_ITEM_REMOVE_BUTTON, this.containerElementRef).removeEventListener('click', this.boundEmitRemoveFn);
            this.containerElementRef.remove();
        }
    }

    private emitRemove(item: Vehicle): void {
        this.cartStore.remove(item);
    }
}
