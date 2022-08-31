import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from './domain/product';
import { Customer } from './domain/customer';
import { CustomerService } from './services/customerservice';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ConfirmationService,MessageService,CustomerService]
})
export class AppComponent implements OnInit {

    customerDialog: boolean;

    customers: Customer[];

    customer: Customer;

    selectedCustomer: Customer[];

    submitted: boolean;

    statuses: any[];

    print: boolean;
    email: boolean;
    einvoice: boolean;

    constructor(private customerService: CustomerService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.customerService.getCustomers().then(data => this.customers = data);

        this.statuses = [
            {label: 'INSTOCK', value: 'instock'},
            {label: 'LOWSTOCK', value: 'lowstock'},
            {label: 'OUTOFSTOCK', value: 'outofstock'}
        ];
    }

    openNew() {
        this.customer = {};
        this.submitted = false;
        this.customerDialog = true;
    }

    deleteSelectedCustomers() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.customers = this.customers.filter(val => !this.selectedCustomer.includes(val));
                this.selectedCustomer = null;
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
            }
        });
    }

    editCustomer(product: Product) {
        this.customer = {...product};
        this.customerDialog = true;
    }

    deleteCustomer(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.customers = this.customers.filter(val => val.id !== product.id);
                this.customer = {};
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
            }
        });
    }

    hideDialog() {
        this.customerDialog = false;
        this.submitted = false;
    }
    
    saveCustomer() {
        this.submitted = true;

        if (this.customer.name.trim()) {
            if (this.customer.id) {
                this.customers[this.findIndexById(this.customer.id)] = this.customer;                
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
            }
            else {
                this.customer.id = this.createId();
                this.customers.push(this.customer);
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
            }

            this.customers = [...this.customers];
            this.customerDialog = false;
            this.customer = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.customers.length; i++) {
            if (this.customers[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( var i = 0; i < 5; i++ ) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
}
