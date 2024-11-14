import 'package:flutter/material.dart';
import 'package:movel_pint/widgets/MycardAtividade.dart';
import 'package:movel_pint/widgets/bottom_navigation_bar.dart';
import 'package:movel_pint/widgets/customAppBar.dart';
import 'package:movel_pint/backend/api_service.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: TodasRecomendacoes(), // Aqui está correto, pois estamos referenciando uma instância da classe.
    );
  }
}

// Classe TodasRecomendacoes que é uma StatefulWidget
class TodasRecomendacoes extends StatefulWidget {
  @override
  _RecomendacaoState createState() => _RecomendacaoState();
}

class _RecomendacaoState extends State<TodasRecomendacoes> {
  int _selectedIndex = 2;
  PageController _pageController = PageController(initialPage: 0);
  List<Map<String, dynamic>> _conteudos = [];
  List<dynamic> _topicos = [];
  List<Map<String, dynamic>> _filteredConteudos = [];
  bool _isLoading = true;
  String? idAtividade;
  String _selectedFilter = 'Mais recentes';
  String? _selectedClassificacao;
  String? _selectedTopico;

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  void _nextPage() {
    if (_pageController.page! < 2) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.ease,
      );
    }
  }

  void _previousPage() {
    if (_pageController.page! > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.ease,
      );
    }
  }

  void _handleFilterSelection(String value) {
    setState(() {
      _selectedFilter = value;
      _applyFilter();
    });
  }

  void _handleClassificacaoSelection(String? value) {
    setState(() {
      _selectedClassificacao = value;
      _applyFilter();
    });
  }

  void _handleTopicoSelection(String? value) {
    setState(() {
      _selectedTopico = value;
      _applyFilter();
    });
  }

  void _applyFilter() {
    setState(() {
      _filteredConteudos = List<Map<String, dynamic>>.from(_conteudos);

      if (_selectedClassificacao != null) {
        print("object classificacao ");
        print(_selectedClassificacao);
        print("object classificacaoa ");

        // Define a lista de classificações que devem ser buscadas com base na classificação selecionada
        List<int> _searchClass = [];

        if (_selectedClassificacao == "Média") {
          _searchClass = [3];
        } else if (_selectedClassificacao == "Alta") {
          _searchClass = [4, 5];
        } else if (_selectedClassificacao == "Baixa") {
          _searchClass = [1, 2];
        } else {
          _searchClass = [1, 2, 3, 4, 5];
        }

        // Filtra _filteredConteudos com base na lista _searchClass
        _filteredConteudos = _filteredConteudos
            .where((conteudo) => _searchClass.contains(conteudo['classificacao']))
            .toList();
      }

      if (_selectedTopico != null) {
        _filteredConteudos = _filteredConteudos
            .where((conteudo) {
              var conteudoSubtopico = conteudo['conteudo_subtopico'];
              if (conteudoSubtopico != null) {
                return conteudoSubtopico['area'] == _selectedTopico;
              }
              return false;
            })
            .toList(); 
      }

      if (_selectedFilter == 'Mais recentes') {
        _filteredConteudos.sort((a, b) => b['data_criacao'].compareTo(a['data_criacao']));
      } else if (_selectedFilter == 'Mais antigas') {
        _filteredConteudos.sort((a, b) => a['data_criacao'].compareTo(b['data_criacao']));
      } else if (_selectedFilter == 'A-Z') {
        _filteredConteudos.sort((a, b) => a['titulo'].compareTo(b['titulo']));
      } else if (_selectedFilter == 'Z-A') {
        _filteredConteudos.sort((a, b) => b['titulo'].compareTo(a['titulo']));
      }
    });
  }

  @override
  void initState() {
    super.initState();
    _fetchConteudos();
    _fetchTopicos();
  }

  Future<void> _fetchTopicos() async {
    try {
      final data = await ApiService.listar('subtopico/simples');
      if (data != null) {
          setState(() => _topicos = data);
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _fetchConteudos() async {
    try {
      final data = await ApiService.listar('conteudo');
      if (data != null) {
        if (data is List) {
          setState(() {
            _conteudos = List<Map<String, dynamic>>.from(data)
                .where((conteudo) => conteudo['tipo'] == 3)
                .toList();
            _filteredConteudos = List<Map<String, dynamic>>.from(_conteudos);
            _applyFilter();
            _isLoading = false;
          });
        } else {
          setState(() {
            _isLoading = false;
          });
        }
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

  void _onCardTap(String id) {
    setState(() {
      idAtividade = id;
    });
    print('ID da atividade selecionada: $idAtividade');
  }

  @override
  Widget build(BuildContext context) {
    print('Construindo widget VerRecomendacoes...');
    return VerRecomendacoes(
      selectedIndex: _selectedIndex,
      onItemTapped: _onItemTapped,
      pageController: _pageController,
      nextPage: _nextPage,
      previousPage: _previousPage,
      handleFilterSelection: _handleFilterSelection,
      handleClassificacaoSelection: _handleClassificacaoSelection,
      handleTopicoSelection: _handleTopicoSelection,
      selectedClassificacao: _selectedClassificacao,
      selectedTopico: _selectedTopico,
      conteudos: _filteredConteudos,
      isLoading: _isLoading,
      onCardTap: _onCardTap,
      topicos: _topicos,
    );
  }
}

class VerRecomendacoes extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onItemTapped;
  final PageController pageController;
  final VoidCallback nextPage;
  final VoidCallback previousPage;
  final Function(String) handleFilterSelection;
  final Function(String?) handleClassificacaoSelection;
  final Function(String?) handleTopicoSelection;
  final String? selectedClassificacao;
  final String? selectedTopico;
  final List<Map<String, dynamic>> conteudos;
  final bool isLoading;
  final Function(String) onCardTap;
  final List<dynamic> topicos;

  const VerRecomendacoes({
    required this.selectedIndex,
    required this.onItemTapped,
    required this.pageController,
    required this.nextPage,
    required this.previousPage,
    required this.handleFilterSelection,
    required this.handleClassificacaoSelection,
    required this.handleTopicoSelection,
    required this.selectedClassificacao,
    required this.selectedTopico,
    required this.conteudos,
    required this.isLoading,
    required this.onCardTap,
    required this.topicos,
  });

  @override
  Widget build(BuildContext context) {
    print('Construindo VerRecomendacoes...');
    return Scaffold(
      appBar: CustomAppBar(),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Center(
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Recomendações',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          PopupMenuButton<String>(
                            icon: const Icon(Icons.filter_list),
                            onSelected: (String value) {
                              handleFilterSelection(value);
                            },
                            itemBuilder: (BuildContext context) =>
                                const <PopupMenuEntry<String>>[
                              PopupMenuItem<String>(
                                value: 'Mais recentes',
                                child: Text('Mais recentes'),
                              ),
                              PopupMenuItem<String>(
                                value: 'Mais antigas',
                                child: Text('Mais antigas'),
                              ),
                              PopupMenuItem<String>(
                                value: 'A-Z',
                                child: Text('A-Z'),
                              ),
                              PopupMenuItem<String>(
                                value: 'Z-A',
                                child: Text('Z-A'),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        DropdownButton<String>(
                          hint: Text("Classificação"),
                          value: selectedClassificacao,
                          onChanged: (String? newValue) {
                            handleClassificacaoSelection(newValue);
                          },
                          items: <String>[
                            'Alta',
                            'Média',
                            'Baixa',
                          ].map<DropdownMenuItem<String>>((String value) {
                            return DropdownMenuItem<String>(
                              value: value,
                              child: Text(value),
                            );
                          }).toList(),
                        ),
                        DropdownButton<String>(
                          hint: Text("Tópico"),
                          value: selectedTopico,
                          onChanged: (String? newValue) {
                            handleTopicoSelection(newValue);
                          },
                          items: topicos.map<DropdownMenuItem<String>>((dynamic topico) {
                            return DropdownMenuItem<String>(
                              value: topico['area'] as String?, // Use a chave 'area' para obter o valor desejado
                              child: Text(topico['area'] as String),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                    conteudos.isNotEmpty
                        ? Column(
                            children: conteudos
                                .map((conteudo) => MyCardAtividade(
                                      atividade: conteudo,
                                      onTap: () => onCardTap(conteudo['id'].toString()),
                                    ))
                                .toList(),
                          )
                        : const Text('Nenhuma recomendação encontrada'),
                  ],
                ),
              ),
            ),
      bottomNavigationBar: CustomBottomNavigationBar(
        selectedIndex: selectedIndex,
        onItemTapped: onItemTapped,
      ),
    );
  }
}
