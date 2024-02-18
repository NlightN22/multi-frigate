import { CartStore } from "./cart.store";
import { CategoryStore } from "./category.store";
import { FiltersStore } from "./filters/filters.store";
import { ModalStore } from "./modal.store";
import { OrdersStore } from "./orders.store";
import { ProductStore } from "./product.store";
import { SettingsStore } from "./settings.store";
import { SideBarsStore } from "./sidebars.store";
import PostStore from "./test.store";
import { UserStore } from "./user.store";

class RootStore {
    userStore: UserStore
    productStore: ProductStore
    cartStore: CartStore
    postStore: PostStore
    modalStore: ModalStore
    categoryStore: CategoryStore
    filtersStore: FiltersStore
    sideBarsStore: SideBarsStore
    ordersStore: OrdersStore
    settingsStore: SettingsStore
    constructor() {
        this.userStore = new UserStore()
        this.productStore = new ProductStore(this)
        this.cartStore = new CartStore()
        this.postStore = new PostStore()
        this.modalStore = new ModalStore(this)
        this.categoryStore = new CategoryStore()
        this.filtersStore = new FiltersStore()
        this.sideBarsStore = new SideBarsStore()
        this.ordersStore = new OrdersStore()
        this.settingsStore = new SettingsStore()
    }
}

export default RootStore
