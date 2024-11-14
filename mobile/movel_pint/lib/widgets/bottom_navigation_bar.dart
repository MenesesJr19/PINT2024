import 'package:flutter/material.dart';
import 'package:ionicons/ionicons.dart';
import 'package:movel_pint/calendario/calendario.dart';
import 'package:movel_pint/home/homepage.dart';
import 'package:movel_pint/Forum/Forum.dart';

class CustomBottomNavigationBar extends StatefulWidget {
  final int selectedIndex;
  final Function(int) onItemTapped;

  const CustomBottomNavigationBar({
    Key? key,
    required this.selectedIndex,
    required this.onItemTapped,
  }) : super(key: key);

  @override
  _CustomBottomNavigationBarState createState() =>
      _CustomBottomNavigationBarState();
}

class _CustomBottomNavigationBarState extends State<CustomBottomNavigationBar> {
  final List<Widget> _pages = [
    HomePageMain(),
    CalendarScreen(),
    ForumPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      items: const <BottomNavigationBarItem>[
        BottomNavigationBarItem(
          icon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.calendar_month),
          label: 'Calendário',
        ),
        BottomNavigationBarItem(
          icon: Icon(Ionicons.grid_outline),
          label: 'Forum',
        ),
      ],
      currentIndex: widget.selectedIndex,
      selectedItemColor: Colors.blue,
      unselectedItemColor: Colors.grey,
      onTap: (index) {
        final currentRoute = ModalRoute.of(context)?.settings.name;
        final targetRoute = _getRouteName(index);

        if (currentRoute == targetRoute) {
          _updateCurrentPage(index);
        } else {
          _navigateToPage(index);
        }

        widget.onItemTapped(index);
      },
    );
  }

  void _navigateToPage(int index) {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (context) => _pages[index],
        settings: RouteSettings(name: _getRouteName(index)),
      ),
    );
  }

  void _updateCurrentPage(int index) {
    // Recarrega a página atual. Pode ser necessário adicionar lógica específica para recarregar a página.
    // Por exemplo, se a página tiver um método para recarregar dados, chame-o aqui.
    // Aqui você pode usar um GlobalKey para acessar o estado da página e chamar métodos específicos.
    // Dependendo da estrutura da sua aplicação, você pode precisar adaptar essa lógica.
    setState(() {
      // Atualiza a página atual.
    });
  }

  String _getRouteName(int index) {
    switch (index) {
      case 0:
        return '/home';
      case 1:
        return '/calendar';
      case 2:
        return '/forum';
      default:
        return '';
    }
  }
}
