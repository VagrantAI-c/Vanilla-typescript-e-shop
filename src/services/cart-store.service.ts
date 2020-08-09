import { Callback } from '../models/callback.type';
import { Vehicle } from '../models/vehicle.model';

export class CartStoreService {

    private listeners = new Set<Callback<Vehicle[]>>();
    private items = new Map<string, Vehicle>();

    public add(item: Vehicle): void {
        this.items.set(item.label, item);
        this.emit();
    }

    public remove(item: Vehicle): void {
        this.items.delete(item.label);
        this.emit();
    }

    public clear(): void {
        this.items.clear();
        this.emit();
    }

    /** 
     * Listens to item changes via provided callback
     * 
     * @returns unlisten callback
     */
    public listen(callbackFn: Callback<Vehicle[]>): void {
        this.listeners.add(callbackFn);
        callbackFn(this.getItems());
    }

    private emit(): void {
        const items = this.getItems();
        Array.from(this.listeners)
            .forEach((callbackFn: Callback<Vehicle[]>) => {
                callbackFn(items);
            });
    } 
    
    private getItems(): Vehicle[] {
        return Array.from(this.items.values());
    }
}
