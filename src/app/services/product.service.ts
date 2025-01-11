import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // private apiUrl = 'http://localhost:3000/api/produtos';
  private apiUrl = 'https://joaobackend.vercel.app/api/produtos';


  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    }).pipe(
        catchError((error) => {
            console.error('Erro ao buscar produtos:', error);
            return of([]);  // Retorna um array vazio em caso de erro
        })
    );
  }



  addProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  confirmPurchase(payload: { productId: number; name: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/confirmar`, payload);
  }
}
