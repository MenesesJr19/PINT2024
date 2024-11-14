import 'package:flutter/material.dart';
import 'package:movel_pint/widgets/NotificationCard.dart';
import 'package:movel_pint/widgets/bottom_navigation_bar.dart';
import 'package:movel_pint/widgets/customAppBar.dart';

class NotificationsPage extends StatelessWidget {

  void _onItemTapped(int index) {
    // Implementação da navegação para o bottom navigation bar
    // Se precisar de alguma modificação específica, me avise!
  }

  int _selectedIndex = 2; // Índice inicial selecionado no bottom navigation bar

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(), // Utiliza o app bar personalizado
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          NotificationCard(
            title: 'Nova mensagem recebida',
            description: 'Você recebeu uma nova mensagem de exemplo.',
            date: '01/06/2024',
          ),
          NotificationCard(
            title: 'Atualização do sistema',
            description: 'Uma nova atualização está disponível para download.',
            date: '30/05/2024',
          ),
          NotificationCard(
            title: 'Lembrete de evento',
            description: 'Lembrete para o evento importante.',
            date: '28/05/2024',
          ),
        ],
      ),
      bottomNavigationBar: CustomBottomNavigationBar(
        selectedIndex: _selectedIndex, // Define o índice selecionado
        onItemTapped: _onItemTapped, // Define a função de callback para quando um item for selecionado
      ),
    );
  }
}
