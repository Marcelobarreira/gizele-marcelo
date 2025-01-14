import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ObservationsComponent } from "../observations/observations.component"; // Adicionado FormsModule
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ObservationsComponent], // Incluído FormsModule aqui
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  products: any[] = [];
  sortedProducts: any[] = [];
  sortKey: string = 'price';
  userName: string = '';
  isLoading: boolean = false;
  selectedQuotas: number = 1;
  pixCopied: boolean = false;
  private productUpdateSubscription?: Subscription;




  selectedProduct: any = null;
  showingPixModal: boolean = false;
  confirmingPurchase: boolean = false;

  newProduct = {
    name: '',
    price: 0,
    description: '',
    quantity: 0,
    link: '',
    image: '',
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.productUpdateSubscription) {
      this.productUpdateSubscription.unsubscribe();
    }
  }

  loadProducts() {
    this.products = [];
    this.isLoading = true;
    this.productService.getProducts().subscribe((data) => {
        this.products = data;
        this.sortProducts();
        this.isLoading = false;
    });
  }

  startAutoRefresh(): void {
    if (typeof window !== 'undefined') {
        this.productUpdateSubscription = interval(30000).subscribe(() => {
            this.loadProducts();
            console.log('✅ Product list updated automatically.');
        });
    }
  }


  addProduct() {
    this.productService.addProduct(this.newProduct).subscribe(() => {
      this.loadProducts();
      this.newProduct = {
        name: '',
        price: 0,
        description: '',
        quantity: 0,
        link: '',
        image: '',
      };
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }

  buyProduct(product: any) {
    this.selectedProduct = product;
  }

  closeModal() {
    this.selectedProduct = null;
  }

  closeModalOnBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  showPixModal() {
    this.showingPixModal = true;
    this.confirmingPurchase = false; // Para evitar conflitos com a confirmação de link
  }

  closePixModal() {
    this.showingPixModal = false;
    this.closeModal();
  }

  closePixModalOnBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closePixModal();
    }
  }

  openProductLink() {
    if (this.selectedProduct) {
      window.open(this.selectedProduct.link, '_blank');
      this.confirmingPurchase = true;
    }
  }

  confirmPurchase(paymentMethod: 'PIX' | 'LINK' = 'LINK') {
    if (this.selectedProduct && this.userName) {
        this.isLoading = true;

        const payload = {
            productId: this.selectedProduct.id,
            name: this.userName,
            quotas: this.selectedProduct.quotaValue ? this.selectedQuotas : 1,
        };

        this.productService.confirmPurchase(payload).subscribe(
            () => {
                alert(`Compra confirmada via ${paymentMethod}! Obrigado, ${this.userName}.`);

                // Recarregar os produtos diretamente da API
                this.loadProducts();

                this.isLoading = false;
                this.confirmingPurchase = false;
                this.showingPixModal = false;
                this.userName = '';
                this.selectedQuotas = 1;
                this.closeModal();
            },
            (error) => {
                console.error('Erro ao confirmar compra:', error);
                alert('Ocorreu um erro ao confirmar a compra.');
                this.isLoading = false;
            }
        );
    } else {
        alert('Por favor, preencha seu nome para confirmar a compra.');
    }
}

  copyPixCode() {
    const pixCode = `85988693542`;
    navigator.clipboard.writeText(pixCode).then(() => {
        this.pixCopied = true;
        setTimeout(() => {
            this.pixCopied = false;
        }, 3000); // Oculta a mensagem após 3 segundos
    }).catch(err => {
        console.error('Erro ao copiar o PIX:', err);
    });
}

  cancelPurchase() {
    this.confirmingPurchase = false;
    this.isLoading = false;
    this.closeModal();
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sortKey = value;
    this.sortProducts();
  }

  sortProducts() {
    if (this.sortKey === 'price') {
      // Ordena por preço (decrescente)
      this.products = [...this.products].sort((a, b) => b.price - a.price);
    } else if (this.sortKey === 'name') {
      // Ordena por nome (crescente)
      this.products = [...this.products].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (this.sortKey === 'quantity') {
      // Ordena por quantidade (decrescente)
      this.products = [...this.products].sort((a, b) => b.quantity - a.quantity);
    }
  }
}
