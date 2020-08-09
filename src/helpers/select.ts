import { AppElement } from '../models/app-element.enum';

export function select(target: AppElement.CART_ITEM_TEMPLATE | AppElement.VEHICLE_CARD_TEMPLATE, container?: HTMLElement): HTMLTemplateElement;
export function select(target: AppElement, container?: HTMLElement): HTMLElement;
export function select(target: string, container?: HTMLElement): HTMLElement {
    const element = (container || document).querySelector(`[${target}]`) as HTMLElement;
    if (!element) {
        throw new Error(`Expected "[${target}]" to be available in DOM`);
    }

    return element;
}
