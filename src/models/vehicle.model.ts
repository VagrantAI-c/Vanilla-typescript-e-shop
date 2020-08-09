export class Vehicle {

    constructor(
        public imageUrl: string,
        /** Also used as entity id */
        public label: string,
        public price: number,
    ) {
    }

}
