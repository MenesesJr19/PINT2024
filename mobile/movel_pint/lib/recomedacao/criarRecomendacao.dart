import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart'; // Adiciona a biblioteca image_picker
import 'package:movel_pint/atividade/mapa.dart';
import 'package:movel_pint/backend/api_service.dart';
import 'package:movel_pint/backend/auth_service.dart';
import 'package:movel_pint/utils/constants.dart';
import 'package:movel_pint/widgets/customAppBar.dart';
import 'package:movel_pint/widgets/bottom_navigation_bar.dart';
import 'package:movel_pint/Forum/Forum.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

void main() {
  runApp(MaterialApp(home: RecomendationFormPage()));
}

class RecomendationFormPage extends StatefulWidget {
  @override
  _RecomendationFormPageState createState() => _RecomendationFormPageState();
}

class _RecomendationFormPageState extends State<RecomendationFormPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _tituloController = TextEditingController();
  final TextEditingController _enderecoController = TextEditingController();
  final TextEditingController _descricaoController = TextEditingController();
  final TextEditingController _PrecoController = TextEditingController();

  Uint8List? _imageData;
  String? _imageBase64;
  String? _selectedSubtopic;
  int _selectedIndex = 2;
  double _rating = 0;
  int preco = 0;
  String? _selectedLocation;
  late int _userId;

  String? endereco; // Variável de instância para a latitude
  String? latitude; // Variável de instância para a latitude
  String? longitude; // Variável de instância para a longitude


  List<dynamic> _subtopics = [];

  @override
  void initState() {
    super.initState();
    _loadUserId();
    _loadSubtopics();
  }

  Future<void> _loadUserId() async {
    dynamic utilizadorAtual = await AuthService.obter();
    setState(() {
      _userId = utilizadorAtual["id"];
    });
  }

  void _showSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
      ),
    );
  }

  Future<void> _loadSubtopics() async {
    try {
      final response = await ApiService.listar("subtopico");
      if (response != null) {
        setState(() {
          _subtopics = response;
        });
      }
    } catch (e) {
      print("Error loading subtopics: $e");
    }
  }

  Future<void> _createRecomendacao() async {
    if (_formKey.currentState!.validate()) {
      if (_imageData == null) {
        _showSnackbar("Por favor, selecione uma imagem.");
        return;
      }

      String name = _tituloController.text;
      String location = _selectedLocation ?? _enderecoController.text;
      String description = _descricaoController.text;
      String subtopic = _selectedSubtopic!;
      preco = int.tryParse(_PrecoController.text) ?? 0;

      Map<String, String> data = {
        'titulo': name,
        'descricao': description,
        'endereco': endereco!,
        'latitude': latitude!,
        'longitude': longitude!,
        'utilizador': _userId.toString(), 
        'subtopico': subtopic,
        'tipo': CONSTANTS.valores['RECOMENDACAO']!['ID'].toString(),
'classificacao': _rating.toInt().toString(),
        'preco': preco.toString(),
      };

      try {
        final response = await ApiService.criarFormDataFile("conteudo/criar", data: data, fileKey: "imagem", file: _imageData!);

        if (response != null) {
          print(data);
          print('$name, $description, $location, $subtopic, $_rating, $preco');
          _showSnackbar("Recomendação criada com sucesso, pode a ver na página das recomendações");
              Navigator.pop(context);

        } else {
          print("Erro ao criar a recomendação: Resposta nula");
        }
      } catch (e) {
        print("Error creating Recomendação: $e");
      }
    }
  }

  Future<void> _getImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      final bytes = await pickedFile.readAsBytes();
      setState(() {
        _imageData = bytes;
        _imageBase64 = base64Encode(bytes);
      });
    } else {
      _showSnackbar("Nenhuma imagem foi selecionada.");
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  void _showCancelDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Cancelar Criação de Recomendação'),
          content: Text('Tem a certeza que quer cancelar a criação da recomendação? Os dados não serão guardados.'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Continuar'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (context) => ForumPage()),
                );
              },
              child: Text('Cancelar'),
            ),
          ],
        );
      },
    );
  }

  Map<String, List<String>> organizarSubtopicos() {
    Map<String, List<String>> categorias = {};

    _subtopics.forEach((subtopico) {
      String topico = subtopico['subtopico_topico']['topico'];
      String area = subtopico['area'];

      if (!categorias.containsKey(topico)) {
        categorias[topico] = [];
      }

      categorias[topico]!.add(area);
    });

    return categorias;
  }

  List<DropdownMenuItem<String>> extrairAreas() {
    List<DropdownMenuItem<String>> items = [];
    _subtopics.forEach((subtopico) {
      final area = subtopico['area'];
      final id = subtopico['id'];

      items.add(DropdownMenuItem<String>(
        value: id.toString(),
        child: Text(area),
      ));
    });
    return items;
  }

    Future<void> _selectLocation() async {
  final result = await showModalBottomSheet<Map<String, dynamic>>(
    context: context,
    builder: (BuildContext context) {
      return Container(
        height: 400,
        child: const MapaSelect(),
      );
    },
  );
  if (result != null) {
    setState(() {
      latitude = result['latitude'].toString(); // Armazena a latitude
      longitude = result['longitude'].toString(); // Armazena a longitude
      endereco = result['address']; // Armazena o endereço
      _enderecoController.text = endereco ?? ''; // Atualiza o TextField do endereço
    });
  }
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Criar Nova Recomendação',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 20),
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    if (_imageData != null)
                      Container(
                        width: double.infinity,
                        height: 200,
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey),
                        ),
                        child: Image.memory(
                          _imageData!,
                          fit: BoxFit.cover,
                        ),
                      ),
                    SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: _getImage,
                      child: Text('Selecionar Imagem'),
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _tituloController,
                      decoration: InputDecoration(
                        labelText: 'Título',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Por favor, insira o nome da recomedação';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _enderecoController,
                            decoration: InputDecoration(
                              labelText: 'Local',
                              border: OutlineInputBorder(),
                            ),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Por favor, insira o local da recomendação';
                              }
                              return null;
                            },
                            enabled: false,
                          ),
                        ),
                        IconButton(
                          icon: Icon(Icons.map), onPressed: () => _selectLocation(),
                        ),
                      ],
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _descricaoController,
                      decoration: InputDecoration(
                        labelText: 'Descrição',
                        border: OutlineInputBorder(),
                      ),
                      maxLines: 3,
                    ),
                    SizedBox(height: 10),
                    DropdownButtonFormField<String>(
                      value: _selectedSubtopic,
                      decoration: InputDecoration(
                        labelText: 'Subtópico',
                        border: OutlineInputBorder(),
                      ),
                      items: extrairAreas(),
                      onChanged: (newValue) {
                        setState(() {
                          _selectedSubtopic = newValue;
                        });
                      },
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Por favor, selecione um subtópico';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _PrecoController,
                      keyboardType: TextInputType.number,
                      inputFormatters: <TextInputFormatter>[
                        FilteringTextInputFormatter.digitsOnly
                      ],
                      decoration: InputDecoration(
                        labelText: 'Preço',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Por favor, insira o preço';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 10),
                    Text('Classificação', style: TextStyle(fontSize: 16)),
                    RatingBar.builder(
                      initialRating: 0,
                      minRating: 1,
                      direction: Axis.horizontal,
                      allowHalfRating: false,
                      itemCount: 5,
                      itemPadding: EdgeInsets.symmetric(horizontal: 4.0),
                      itemBuilder: (context, _) => Icon(
                        Icons.star,
                        color: Colors.amber,
                      ),
                      onRatingUpdate: (rating) {
                        setState(() {
                          _rating = rating;
                        });
                      },
                    ),
                    SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        ElevatedButton(
                          onPressed: () {
                            _showCancelDialog();
                          },
                          style: ElevatedButton.styleFrom(backgroundColor: Color.fromRGBO(247, 245, 249, 1)),
                          child: const Text('Cancelar'),
                        ),
                        ElevatedButton(
                          onPressed: () => _createRecomendacao(),
                          child: const Text('Criar recomendação'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: CustomBottomNavigationBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }
}
