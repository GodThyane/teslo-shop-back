export interface IDashboard {
  numberOfOrders: number;
  paidOrders: number;
  pendingOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  productsWithNoInventory: number;
  lowInventory: number;
}
