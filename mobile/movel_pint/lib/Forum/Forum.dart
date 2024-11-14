import 'package:flutter/material.dart';
import 'package:movel_pint/atividade/TodasAtividades.dart';
import 'package:movel_pint/atividade/criarAtividade.dart';
import 'package:movel_pint/espa%C3%A7o/TodosEspacos.dart';
import 'package:movel_pint/espaço/criarespaço.dart';
import 'package:movel_pint/evento/TodosEventos.dart';
import 'package:movel_pint/evento/criarEvento.dart';
import 'package:movel_pint/recomedacao/TodasRecomendacoes.dart';
import 'package:movel_pint/recomedacao/criarRecomendacao.dart';
import 'package:movel_pint/utils/constants.dart';
import 'package:movel_pint/widgets/bottom_navigation_bar.dart';
import 'package:movel_pint/widgets/customAppBar.dart';
import 'package:movel_pint/widgets/minicard.dart';
import 'package:movel_pint/backend/api_service.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: ForumPage(),
    );
  }
}

class ForumPage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<ForumPage> {
  int _selectedIndex = 2;
  final PageController _pageController = PageController();
  List<dynamic> _atividades = [];
  List<dynamic> _eventos = [];
  List<dynamic> _recomendacoes = [];
  List<dynamic> _espacos = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchConteudos();
  }

  Future<void> _fetchConteudos() async {
    try {
      print('Chamando API para buscar dados...');
      final data = await ApiService.listar('conteudo/listagem');
      print(data);
      if (data != null) {
        print('Data não é nulo');
        setState(() {
          _atividades = data[CONSTANTS.valores['ATIVIDADE']!['ID'].toString()];
          _eventos = data[CONSTANTS.valores['EVENTO']!['ID'].toString()];
          _recomendacoes = data[CONSTANTS.valores['RECOMENDACAO']!['ID'].toString()];
          _espacos = data[CONSTANTS.valores['ESPACO']!['ID'].toString()];
          _isLoading = false; 
        });
      } else {
        print('Nenhum dado encontrado ou dado malformado');
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Erro ao carregar conteúdos: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    _pageController.jumpToPage(index);
  }

  void _onCardTap(String id) {
    print('ID da atividade: $id');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : PageView(
              controller: _pageController,
              onPageChanged: (index) {
                setState(() {
                  _selectedIndex = index;
                });
              },
              children: [
                buildHomePage(context),
              ],
            ),
      bottomNavigationBar: CustomBottomNavigationBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget buildHomePage(BuildContext context) {
    return ListView(
      padding: EdgeInsets.all(16.0),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Fórum',
              style: TextStyle(
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            _buildAddButton(), 
          ],
        ),
        SizedBox(height: 20.0),
        buildSection('Atividades', _atividades, context),
        buildSection('Eventos', _eventos, context),
        buildSection('Recomendações', _recomendacoes, context),
        buildSection('Espaços', _espacos, context),
      ],
    );
  }

  Widget buildSection(String title, List<dynamic> conteudos, BuildContext context) {
    final ScrollController scrollController = ScrollController(); 

    if (conteudos.isEmpty) return Container();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionTitle(
          title: title,
          onViewMore: () {
            if (title == 'Atividades') {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => TodasAtividades(), 
                ),
              );
            } else if (title == 'Eventos') {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => TodosEventos(), 
                ),
              );
            } else if (title == 'Recomendações') {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => TodasRecomendacoes(), 
                ),
              );
            } else if (title == 'Espaços') {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => TodasEspacos(), 
                ),
              );
            }
          },
        ),
        SizedBox(height: 10.0),
        SizedBox(
          height: 200.0,
          child: Column(
            children: [
              Expanded(
                child: Scrollbar(
                  controller: scrollController,
                  thumbVisibility: true, 
                  child: ListView.builder(
                    controller: scrollController,
                    scrollDirection: Axis.horizontal,
                    itemCount: conteudos.take(6).length, 
                    itemBuilder: (context, index) {
                      final conteudo = conteudos[index];
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: MiniCard(
                          imageUrl: conteudo['imagem'] ?? 'assets/Images/imageMissing.jpg', 
                          title: conteudo['titulo'] ?? 'Título',
                          atividade: conteudo,
                          onTap: () => _onCardTap(conteudo['id'].toString()),
                        ),
                      );
                    },
                  ),
                ),
              ),
              SizedBox(height: 10.0), 
            ],
          ),
        ),
        SizedBox(height: 20.0), 
      ],
    );
  }

  Widget _buildAddButton() {
    return GestureDetector(
      onTap: () {
        _showOptionsDialog(context);
      },
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
        decoration: BoxDecoration(
          color: Colors.blue,
          borderRadius: BorderRadius.circular(20.0), 
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Adicionar',
              style: TextStyle(fontSize: 16.0, color: Colors.white),
            ),
            SizedBox(width: 8.0),
            Icon(Icons.add, color: Colors.white),
          ],
        ),
      ),
    );
  }

  void _showOptionsDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Selecione uma opção'),
          content: SingleChildScrollView(
            child: ListBody(
              children: [
                ListTile(
                  leading: Icon(Icons.sports_soccer),
                  title: Text('Atividades'),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => CreateActivityPage(),
                      ),
                    );
                  },
                ),
                ListTile(
                  leading: Icon(Icons.event),
                  title: Text('Eventos'),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => EventFormPage(),
                      ),
                    );
                  },
                ),
                ListTile(
                  leading: Icon(Icons.thumb_up),
                  title: Text('Recomendações'),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => RecomendationFormPage(),
                      ),
                    );
                  },
                ),
                ListTile(
                  leading: Icon(Icons.location_city),
                  title: Text('Espaços'),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => SpaceFormPage(),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  String _selectedOption = ''; 

  void _selectOption(String option) {
    setState(() {
      _selectedOption = option;
    });
  }
}

class SectionTitle extends StatelessWidget {
  final String title;
  final VoidCallback onViewMore;

  SectionTitle({required this.title, required this.onViewMore});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold),
        ),
        GestureDetector(
          onTap: onViewMore,
          child: Text(
            'Ver mais...',
            style: TextStyle(fontSize: 14.0, color: Colors.blue),
          ),
        ),
      ],
    );
  }
}
