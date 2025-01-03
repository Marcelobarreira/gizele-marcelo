import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-observations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './observations.component.html',
  styleUrls: ['./observations.component.scss'],
})
export class ObservationsComponent {
  observations: string[] = [
    'Gostamos de tons terrosos e cores neutras.',
    'Preferimos utensílios que combinem com madeira e aço inox.',
    'Adoramos itens práticos e funcionais para o dia a dia.',
    'Estamos muito animados para compartilhar este momento com vocês!',
  ];
}
