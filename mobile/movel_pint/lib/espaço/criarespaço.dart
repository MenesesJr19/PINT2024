import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';  // Importação do image_picker
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
  runApp(MaterialApp(home: SpaceFormPage()));
}

class SpaceFormPage extends StatefulWidget {
  @override
  _SpaceFormPageState createState() => _SpaceFormPageState();
}

class _SpaceFormPageState extends State<SpaceFormPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _tituloController = TextEditingController();
  final TextEditingController _enderecoController = TextEditingController();
  final TextEditingController _descricaoController = TextEditingController();
  final TextEditingController _PrecoController = TextEditingController();

  Uint8List? _imageData;
  String? _selectedSubtopic;
  int _selectedIndex = 2;
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
    try {
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
          'tipo': CONSTANTS.valores['ESPACO']!['ID'].toString(),
        };

        final response = await ApiService.criarFormDataFile("conteudo/criar", data: data, fileKey: "imagem", file: _imageData!);

        if (response != null) {
          _showSnackbar("Espaço criado com sucesso, pode a ver na página dos espaços");
              Navigator.pop(context);

        } else {
          print("Erro ao criar o espaço: Resposta nula");
        }
      }
    } catch (e) {
      print("Error creating Espaço: $e");
    }


  }

  Future<void> _getImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      final bytes = await pickedFile.readAsBytes();
      setState(() {
        _imageData = bytes;
      });
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
          title: Text('Cancelar Criação do espaço'),
          content: Text('Tem a certeza que quer cancelar a criação do espaço? Os dados não serão guardados.'),
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

  Future<void> _openMapDialog() async {
    final selectedLocation = await showDialog<String>(
      context: context,
      builder: (BuildContext context) {
        LatLng _initialPosition = LatLng(-15.7942, -47.8822); 
        LatLng? _pickedLocation;

        return AlertDialog(
          title: Text('Escolha o Local no Mapa'),
          content: Container(
            width: double.infinity,
            height: 400,
            child: GoogleMap(
              initialCameraPosition: CameraPosition(
                target: _initialPosition,
                zoom: 15,
              ),
              onTap: (LatLng location) {
                _pickedLocation = location;
              },
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Cancelar'),
            ),
            TextButton(
              onPressed: () {
                if (_pickedLocation != null) {
                  Navigator.of(context).pop(
                    '${_pickedLocation!.latitude}, ${_pickedLocation!.longitude}',
                  ); 
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Por favor, selecione um local no mapa.'),
                    ),
                  );
                }
              },
              child: Text('OK'),
            ),
          ],
        );
      },
    );

    if (selectedLocation != null) {
      setState(() {
        _selectedLocation = selectedLocation;
        _enderecoController.text = _selectedLocation!;
      });
    }
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
                'Criar Novo espaço',
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
                          return 'Por favor, insira o nome do espaço';
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
                                return 'Por favor, insira o local do espaço';
                              }
                              return null;
                            },
                          enabled: false,
                          ),
                        ),
                        IconButton(
                          icon: Icon(Icons.map),
                          onPressed: _selectLocation,
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
                    SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        ElevatedButton(
                          onPressed: _showCancelDialog,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color.fromRGBO(247, 245, 249, 1),
                          ),
                          child: const Text('Cancelar'),
                        ),
                        ElevatedButton(
                          onPressed: _createRecomendacao,
                          child: const Text('Criar espaço'),
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
