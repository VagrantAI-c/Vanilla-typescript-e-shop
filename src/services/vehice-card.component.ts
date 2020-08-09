import { beautifyPrice } from '../helpers/beautify-price';
import { select } from '../helpers/select';
import { AppElement } from '../models/app-element.enum';
import { Vehicle } from '../models/vehicle.model';
import { CartStoreService } from './cart-store.service';

export class VehicleCardComponent {

    constructor(
        private cartStore: CartStoreService,
    ) {
    }

    public render(item: Vehicle, container: HTMLElement): void {
        const templateRef = select(AppElement.VEHICLE_CARD_TEMPLATE).content.cloneNode(true) as HTMLElement;
        select(AppElement.VEHICLE_CARD_IMAGE, templateRef).setAttribute('src', item.imageUrl);
        select(AppElement.VEHICLE_CARD_NAME_LABEL, templateRef).textContent = item.label;
        select(AppElement.VEHICLE_CARD_PRICE_LABEL, templateRef).textContent = beautifyPrice(item.price);
        select(AppElement.VEHICLE_CARD_PURCHASE_BUTTON, templateRef).addEventListener('click', this.purchase.bind(this, item));
        container.appendChild(templateRef);
    }

    private purchase(item: Vehicle): void {
        this.cartStore.add(item);
    }
}
