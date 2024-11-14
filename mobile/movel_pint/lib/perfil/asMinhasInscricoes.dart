import 'package:flutter/material.dart';
import 'package:movel_pint/Forum/Forum.dart';
import 'package:movel_pint/atividade/detalhes_atividade.dart';
import 'package:movel_pint/backend/api_service.dart';
import 'package:movel_pint/backend/auth_service.dart';
import 'package:movel_pint/calendario/calendario.dart';
import 'package:movel_pint/widgets/MycardAtividade.dart';
import 'package:movel_pint/widgets/bottom_navigation_bar.dart';
import 'package:movel_pint/widgets/customAppBar.dart';

class MinhasInscricoesPage extends StatefulWidget {
  @override
  _MinhasInscricoesPageState createState() => _MinhasInscricoesPageState();
}

class _MinhasInscricoesPageState extends State<MinhasInscricoesPage> {
  int _selectedIndex = 0; 
  List<dynamic> _atividades = [];

  @override
  void initState() {
    super.initState();
    _fetchAndSetAtividades();
  }

  Future<void> _fetchAndSetAtividades() async {
    try {
      dynamic data = await AuthService.obter();
      int _userId = data['id'];
      final List<dynamic> atividades = await ApiService.listar('conteudo');
      final List<dynamic> atividadesFiltradas = atividades.where((atividadeitem) {
        final participanteConteudo = atividadeitem['participante_conteudo'];

        if (participanteConteudo != null && participanteConteudo is List) {
          return participanteConteudo.any((item) => item['utilizador'] == _userId);
        }

        return false;
      }).toList();
      setState(() {
        _atividades = atividadesFiltradas;
      });
    } catch (e) {
      print('Erro ao conectar ao servidor: $e');
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });

    switch (index) {
      case 0:
        break;
      case 1:
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => CalendarScreen()),
        );
        break;
      case 2:
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => ForumPage()),
        );
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(),
      body: _atividades.isEmpty
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _atividades.length,
              itemBuilder: (context, index) {
                final atividade = _atividades[index];
                return MyCardAtividade(
                  atividade: atividade,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            ActivityDetailsPage(activityId: atividade['id']),
                      ),
                    );
                  },
                );
              },
            ),
      bottomNavigationBar: CustomBottomNavigationBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }
}

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: MinhasInscricoesPage(),
    );
  }
}
