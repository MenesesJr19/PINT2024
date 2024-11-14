import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:movel_pint/backend/api_service.dart';
import 'package:movel_pint/backend/auth_service.dart';
import 'package:movel_pint/utils/constants.dart';
import 'package:movel_pint/widgets/customAppBar.dart';
import 'package:movel_pint/widgets/bottom_navigation_bar.dart';
import 'package:movel_pint/Forum/Forum.dart';

void main() {
  runApp(MaterialApp(home: EditActivityPage(atividade: {})));
}

class EditActivityPage extends StatefulWidget {
  final Map<String, dynamic> atividade;

  const EditActivityPage({Key? key, required this.atividade}) : super(key: key);

  @override
  _EditActivityPageState createState() => _EditActivityPageState();
}

class _EditActivityPageState extends State<EditActivityPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _tituloController = TextEditingController();
  final TextEditingController _enderecoController = TextEditingController();
  final TextEditingController _descricaoController = TextEditingController();
  final TextEditingController _precoController = TextEditingController();
  double _classificacao = 0;
  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;
  String? _selectedSubtopic;
  int _selectedIndex = 2;
  late int _userId;


  List<dynamic> _subtopics = [];

  @override
  void initState() {
    super.initState();
    _initializeFields();
    _loadSubtopics();
    _loadUserId();
  }

    Future<void> _loadUserId() async {
    dynamic utilizadorAtual = await AuthService.obter();
    setState(() {
      _userId = utilizadorAtual["id"];
    });
  }


  Future<void> _initializeFields() async {
    _tituloController.text = widget.atividade['titulo'] ?? '';
    _enderecoController.text = widget.atividade['endereco'] ?? '';
    _descricaoController.text = widget.atividade['descricao'] ?? '';

    int tipo = widget.atividade['tipo'];

    if (tipo == 3) {
      _precoController.text = widget.atividade['preco']?.toString() ?? '';
      _classificacao = widget.atividade['classificacao']?.toDouble() ?? 0;
    }

    if (tipo == 1 || tipo == 2) {
      if (widget.atividade['data_evento'] != null) {
        _selectedDate = DateTime.parse(widget.atividade['data_evento']);
        _selectedTime = TimeOfDay.fromDateTime(_selectedDate!);
      }
    }
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

  Future<void> _updateAtividade() async {
    if (_formKey.currentState!.validate()) {
      int tipo = widget.atividade['tipo'];

      Map<String, dynamic> data = {
        'titulo': _tituloController.text,
        'descricao': _descricaoController.text,
        'endereco': _enderecoController.text,
        'utilizador': _userId,
        'subtopico': _selectedSubtopic ?? widget.atividade['subtopico']['id'].toString(),
      };

      if (tipo == 3) {
        data['preco'] = _precoController.text.isNotEmpty ? double.parse(_precoController.text) : null;
        data['classificacao'] = _classificacao;
      }

      if (tipo == 1 || tipo == 2) {
        if (_selectedDate != null) {
          data['data_evento'] = _selectedDate!.toIso8601String();
        }
      }

      try {
        await ApiService.atualizar("conteudo", widget.atividade['id'], data: data);

        _showSnackbar("Atividade atualizada com sucesso");
            Navigator.pop(context);
        
      } catch (e) {
        print("Error updating atividade: $e");
        _showSnackbar("Erro ao atualizar atividade");
      }
      Navigator.pop(context);
    }
  }

  Future<void> _selectDate() async {
    int tipo = widget.atividade['tipo'];
    if (tipo != 1 && tipo != 2) {
      return;
    }

    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime(2030),
    );
    if (pickedDate != null) {
      setState(() {
        _selectedDate = pickedDate;
        _selectedTime = null;
      });
    }
  }

  Future<void> _selectTime() async {
    int tipo = widget.atividade['tipo'];
    if (tipo != 1 && tipo != 2) {
      return;
    }

    final TimeOfDay? pickedTime = await showTimePicker(
      context: context,
      initialTime: _selectedTime ?? TimeOfDay.now(),
    );
    if (pickedTime != null) {
      setState(() {
        _selectedTime = pickedTime;
      });
    }
  }

  void _showSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
      ),
    );
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
          title: Text('Cancelar Edição da atividade'),
          content: Text('Tem a certeza que quer cancelar a edição da atividade? As alterações não serão guardadas.'),
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

  List<DropdownMenuItem<String>> extrairAreas() {
    List<DropdownMenuItem<String>> items = [];
    items.add(DropdownMenuItem<String>(
      value: null,
      child: Text('Selecione um subtópico'),
    ));
    _subtopics.forEach((subtopico) {
      final area = subtopico['area'];
      final id = subtopico['id'].toString();

      items.add(DropdownMenuItem<String>(
        value: id,
        child: Text(area),
      ));
    });
    return items;
  }

  Widget _buildStarRating() {
    final int numberOfStars = 5;
    List<Widget> stars = [];

    for (int i = 1; i <= numberOfStars; i++) {
      Icon icon;
      if (_classificacao >= i) {
        icon = Icon(Icons.star, color: Colors.orange);
      } else {
        icon = Icon(Icons.star_border, color: Colors.orange);
      }
      stars.add(
        IconButton(
          iconSize: 30,
          icon: icon,
          onPressed: () {
            setState(() {
              _classificacao = i.toDouble();
            });
          },
        ),
      );
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: stars,
    );
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
                'Editar Atividade',
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
                    TextFormField(
                      controller: _tituloController,
                      decoration: InputDecoration(
                        labelText: 'Título',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Por favor, insira o nome da atividade';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _enderecoController,
                      decoration: InputDecoration(
                        labelText: 'Local',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Por favor, insira o local da atividade';
                        }
                        return null;
                      },
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
                    if (widget.atividade['tipo'] == 3) ...[
                      _buildStarRating(),
                      SizedBox(height: 10),
                      TextFormField(
                        controller: _precoController,
                        decoration: InputDecoration(
                          labelText: 'Preço',
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.number,
                      ),
                    ],
                    SizedBox(height: 10),
                    DropdownButtonFormField<String>(
                      value: _selectedSubtopic,
                      items: extrairAreas(),
                      onChanged: (valor) => setState(() => _selectedSubtopic = valor),
                      validator: (valor) =>
                          valor == null ? 'Selecione um tópico para esta subatividade' : null,
                    ),
                    SizedBox(height: 20),
                    if (widget.atividade['tipo'] == 1 || widget.atividade['tipo'] == 2) ...[
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              readOnly: true,
                              controller: _selectedDate != null
                                  ? TextEditingController(
                                      text: '${DateFormat('dd/MM/yyyy').format(_selectedDate!)}')
                                  : null,
                              decoration: InputDecoration(
                                labelText: 'Data',
                                border: OutlineInputBorder(),
                              ),
                              onTap: _selectDate,
                              validator: (value) {
                                if (_selectedDate == null) {
                                  return 'Por favor, selecione a data da atividade';
                                }
                                return null;
                              },
                            ),
                          ),
                          IconButton(
                            icon: Icon(Icons.calendar_today),
                            onPressed: _selectDate,
                          ),
                        ],
                      ),
                      SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              readOnly: true,
                              controller: _selectedTime != null
                                  ? TextEditingController(
                                      text: '${_selectedTime!.hour}:${_selectedTime!.minute}')
                                  : null,
                              decoration: InputDecoration(
                                labelText: 'Hora',
                                border: OutlineInputBorder(),
                              ),
                              onTap: _selectTime,
                              validator: (value) {
                                if (_selectedTime == null) {
                                  return 'Por favor, selecione a hora da atividade';
                                }
                                return null;
                              },
                            ),
                          ),
                          IconButton(
                            icon: Icon(Icons.access_time),
                            onPressed: _selectTime,
                          ),
                        ],
                      ),
                    ],
                    SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        ElevatedButton(
                          onPressed: () {
                            _showCancelDialog();
                          },
                          style: ElevatedButton.styleFrom(
                              backgroundColor: Color.fromRGBO(247, 245, 249, 1)),
                          child: const Text('Cancelar'),
                        ),
                        ElevatedButton(
                          onPressed: () => _updateAtividade(),
                          child: const Text('Atualizar Atividade'),
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
