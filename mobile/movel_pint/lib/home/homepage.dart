import 'package:flutter/material.dart';
import 'package:movel_pint/Forum/Forum.dart';
import 'package:movel_pint/atividade/TodasAtividades.dart';
import 'package:movel_pint/atividade/criarAtividade.dart';
import 'package:movel_pint/espaço/TodosEspacos.dart';
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
      home: HomePageMain(), 
    );
  }
}

class HomePageMain extends StatefulWidget {
  @override
  _HomePageMainState createState() => _HomePageMainState();
}

  void _onCardTap(String id) {
    print('ID da atividade: $id');
  }

class _HomePageMainState extends State<HomePageMain> {
  int _selectedIndex = 0; 
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
      final data = await ApiService.listar('conteudo/listagem');
      if (data != null) {
        setState(() {
          _atividades = data[CONSTANTS.valores['ATIVIDADE']!['ID'].toString()];
          _eventos = data[CONSTANTS.valores['EVENTO']!['ID'].toString()];
          _recomendacoes = data[CONSTANTS.valores['RECOMENDACAO']!['ID'].toString()];
          _espacos = data[CONSTANTS.valores['ESPACO']!['ID'].toString()];
          _isLoading = false; 
        });
      } else {
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildImageCarousel(),
                  SizedBox(height: 20.0),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: Text(
                      'Últimas atividades',
                      style: TextStyle(
                        fontSize: 24.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  SizedBox(height: 10.0),
                  buildSection('Atividades', _atividades, context),
                  buildSection('Eventos', _eventos, context),
                  buildSection('Recomendações', _recomendacoes, context),
                  buildSection('Espaços', _espacos, context),
                ],
              ),
            ),
      bottomNavigationBar: CustomBottomNavigationBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
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
                    itemCount: conteudos.take(3).length,
                    itemBuilder: (context, index) {
                      final conteudo = conteudos[index];
                      final tipo = conteudo['tipo'] ?? 0;

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

  Widget _buildImageCarousel() {
    return SizedBox(
      height: 240,
      width: 900,
      child: Stack(
        children: [
          PageView.builder(
            controller: _pageController,
            scrollDirection: Axis.horizontal,
            itemCount: _atividades.length,
            itemBuilder: (BuildContext context, int index) {
              return Container(
                width: 300,
                height: 200,
                child: Image.network(
                  'https://t4.ftcdn.net/jpg/03/84/55/29/360_F_384552930_zPoe9zgmCF7qgt8fqSedcyJ6C6Ye3dFs.jpg',
                  fit: BoxFit.cover,
                ),
              );
              
            },
          ),
        ],
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
      ],
    );
  }
}
