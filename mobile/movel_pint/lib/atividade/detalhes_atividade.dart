import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:movel_pint/atividade/editarAtividade.dart';
import 'package:movel_pint/atividade/slideralbuns.dart';
import 'package:movel_pint/backend/auth_service.dart';
import 'package:movel_pint/widgets/bottom_navigation_bar.dart';
import 'package:movel_pint/widgets/customAppBar.dart';
import 'package:movel_pint/backend/api_service.dart';
import 'package:share/share.dart';

class ActivityDetailsPage extends StatefulWidget {
  final int activityId;

  ActivityDetailsPage({required this.activityId});

  @override
  _ActivityDetailsPageState createState() => _ActivityDetailsPageState();
}

class _ActivityDetailsPageState extends State<ActivityDetailsPage> {
  int _selectedIndex = 2;
  Map<String, dynamic>? _activityDetails;
  List<dynamic>? _comments;
  bool _showAllComments = false;
  bool _isParticipating = false;
  bool _isLoadingDetails = false;
  int? _userParticipationId;
  Set<int> _ratedCommentIds = Set<int>();
  Map<int, int> _userRatings = {};
  Map<int, String>? _userMap;
  late int _userId;
  bool _isLoading = true;
  

  TextEditingController _commentController = TextEditingController();

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  void initState() {
    super.initState();
   _fetch();
  }

   void _fetch() async {
    await _loadUserId();
   await _fetchExistingReports();
   await _fetchActivityDetails(widget.activityId);
   await _fetchEventsForUser();
  }

    Future<void> _loadUserId() async {
      dynamic utilizadorAtual = await AuthService.obter();
      setState(() {
        _userId = utilizadorAtual["id"];
        _isLoading = false;
      });
    }

  void _navigateToAtividadeEditarPage() async {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => EditActivityPage(atividade: _activityDetails!),
      ),
    );
  }

  void _navigateToAlbumSliderPage() async {
    List<String> albumImages = await _fetchAlbums();
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => AlbumSliderPage(contentId: widget.activityId, albumImages: albumImages),
      ),
    );
  }

Future<void> _fetchActivityDetails(int activityId) async {
  try {
    setState(() {
      _isLoadingDetails = true;
    });

    final data = await ApiService.obter('conteudo', activityId);
    if (data != null) {
      final users = await _fetchUsers();
      final userRatings = await _fetchUserRatings();

      setState(() {
        _activityDetails = data;
        _comments = data['comentario_conteudo'];
        _userMap = users;
        _userRatings = userRatings;
      });
    } else {
      print('Dados não encontrados ou inválidos');
    }
  } catch (e) {
    print('Erro ao carregar dados: $e');
  } finally {
    setState(() {
      _isLoadingDetails = false;
    });
  }
}

  Future<Map<int, String>> _fetchUsers() async {
    try {
      final users = await ApiService.listar('utilizador/simples');
      return Map.fromIterable(users,
          key: (user) => user['id'],
          value: (user) => '${user['nome']} ${user['sobrenome']}');
    } catch (e) {
      print('Erro ao carregar dados dos utilizadores: $e');
      return {};
    }
  }
Future<Map<int, int>> _fetchUserRatings() async {
  try {
    final ratings = await ApiService.listar('classificacao', data: {'utilizador': _userId});
    final filteredRatings = ratings.where((rating) => rating['comentario'] != null).toList();
    return Map.fromIterable(
      filteredRatings,
      key: (rating) => rating['comentario'],
      value: (rating) => (rating['classificacao'] ?? 0).toInt(),
    );
  } catch (e) {
    print('Erro ao carregar classificações do utilizador: $e');
    return {};
  }
}


  Future<List<String>> _fetchAlbums() async {
    List<String> albumImages = [];
    try {
      final albums = await ApiService.listar('album');
      if (albums != null) {
        for (var album in albums) {
          if (album['conteudo'] == widget.activityId &&
              album['imagem'] != null) {
            albumImages.add(album['imagem']);
          }
        }
      } else {
        print('Nenhum álbum encontrado para este conteúdo');
      }
    } catch (e) {
      print('Erro ao carregar imagens dos álbuns: $e');
    }
    return albumImages;
  }

  Future<void> _fetchEventsForUser() async {
    try {
      final participants = await ApiService.listar('participante', data: {'utilizador': _userId, 'conteudo': widget.activityId});
      setState(() {
        _isParticipating = participants
            .any((participant) => participant['conteudo'] == widget.activityId && participant['utilizador'] == _userId);
        if (_isParticipating) {
          _userParticipationId = participants.firstWhere((participant) =>
              participant['conteudo'] == widget.activityId)['id'];
        } else {
          _userParticipationId = null;
        }
      });
    } catch (e) {
      print('Erro ao carregar dados: $e');
    }
  }

  Future<void> _postParticipation(int activityId, int userId) async {
    Map<String, dynamic> participationData = {
      'utilizador': userId, 
      'conteudo': activityId,
    };
    try {
      final response =
          await ApiService.postData('participante/criar', participationData);
      _fetchEventsForUser();
    } catch (e) {
      print('Erro ao registrar participação: $e');
    }
  }

Future<void> _deleteComment(int commentId) async {
  try {
    var commentToDelete =
        _comments!.firstWhere((comment) => comment['id'] == commentId);
    var userIdOfComment = commentToDelete['utilizador'];
    var currentUserId = _userId;
    
    if (userIdOfComment == currentUserId) {
      await ApiService.deleteData('comentario/remover/$commentId');
      setState(() {
        _comments!.removeWhere((comment) => comment['id'] == commentId);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Você não pode excluir este comentário.'))
      );
    }
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Não é possivel remover o comentario porque alguém o classificou!'))
    );
  }
}

  Future<void> _deleteInscricao(int participacaoID) async {
    try {
      await ApiService.deleteData('participante/remover/$participacaoID');
      setState(() {
        _isParticipating = false;
        _userParticipationId = null;
      });
    } catch (e) {
      print('Erro ao cancelar inscrição: $e');
    }
  }

  Future<Map<String, dynamic>?> _postComment() async {
    setState(() {
      _isLoadingDetails = true;
    });

    Map<String, dynamic> commentData = {
      'comentario': _commentController.text,
      'conteudo': widget.activityId,
      'utilizador': _userId, 
    };
    try {
      final response =
          await ApiService.postData('comentario/criar', commentData);
      await _fetchActivityDetails(widget.activityId);
      return response;
    } catch (e) {
      print('Erro ao enviar comentário: $e');
      return null;
    } finally {
      setState(() {
        _isLoadingDetails = false;
        _commentController.clear();
      });
    }
  }

Future<void> _rateComment(int commentId, int rating) async {
  if (_ratedCommentIds.contains(commentId)) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Você já classificou este comentário.'),
      ),
    );
    return;
  }

  Map<String, dynamic> rateData = {
    'comentario': commentId,
    'conteudo': null,
    'utilizador': _userId, 
    'classificacao': rating,
  };

  try {
    final response = await ApiService.postData('classificacao/criar', rateData);
    setState(() {
      var index = _comments!.indexWhere((comment) => comment['id'] == commentId);
      if (index != -1) {
        _comments![index]['classificacao_comentario'] = rating;
        _ratedCommentIds.add(commentId);
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Comentário classificado com sucesso.'),
      ),
    );
  } catch (e) {
    print('Erro ao classificar comentário: $e');
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Erro ao classificar comentário. Tente novamente.'),
      ),
    );
  }
}


  String _formatDateTime(String dateTime) {
    final DateTime parsedDateTime = DateTime.parse(dateTime);
    final DateFormat formatter = DateFormat('dd/MM/yyyy HH:mm');
    return formatter.format(parsedDateTime);
  }

Future<void> _confirmDeleteComment(int commentId) async {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: Text("Confirmação"),
        content: Text("Tem certeza que deseja apagar o comentário?"),
        actions: <Widget>[
          TextButton(
            child: Text("Cancelar"),
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
          TextButton(
            child: Text("Apagar"),
            onPressed: () async {
              Navigator.of(context).pop();
              await _deleteComment(commentId); 
            },
          ),
        ],
      );
    },
  );
}
  void _confirmParticipation() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Confirmação"),
          content: Text("Tem certeza que deseja participar desta atividade?"),
          actions: <Widget>[
            TextButton(
              child: Text("Cancelar"),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text("Participar"),
              onPressed: () {
                Navigator.of(context).pop();
                _postParticipation(widget.activityId, _userId); 
              },
            ),
          ],
        );
      },
    );
  }

  void _confirmCancelParticipation() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Confirmação"),
          content: Text(
              "Tem certeza que deseja cancelar sua participação nesta atividade?"),
          actions: <Widget>[
            TextButton(
              child: Text("Cancelar"),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text("Cancelar participação"),
              onPressed: () {
                Navigator.of(context).pop();
                _deleteInscricao(_userParticipationId!);
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _rateContent(int contentId, int rating) async {
    Map<String, dynamic> rateData = {
      'comentario': null,
      'conteudo': contentId,
      'utilizador': _userId, 
      'classificacao': rating,
    };

    try {
      final response = await ApiService.postData('classificacao/criar', rateData);

      setState(() {
        if (_activityDetails != null) {
          _activityDetails!['classificacao'] = rating;
        }
      });
    } catch (e) {
      print('Erro ao classificar conteúdo: $e');
    }
  }

void _shareContent() {
  Clipboard.setData(ClipboardData(text: 'http://web-6grl.onrender.com/conteudos/${widget.activityId}'));

  Share.share('http://web-6grl.onrender.com/conteudos/${widget.activityId}');
}

//REPORT_______________________________________________________________________________________________

Future<dynamic> _fetchExistingReports() async {
  try {
    final response = await ApiService.listar('denuncia', data: {'utilizador': _userId});
    return response;
  } catch (e) {
    print('Erro ao buscar denúncias: $e');
    throw e;
  }
}


void _showReportDialog(int commentId) async {
  List<dynamic> existingReports = await _fetchExistingReports();
  bool alreadyReported = existingReports.any((report) =>
      report['comentario'] == commentId &&
      report['denuncia_utilizador']['id'] == _userId);

  if (alreadyReported) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Você já denunciou este comentário.'),
      ),
    );
    return;
  }

  TextEditingController reportController = TextEditingController();

  showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: Text("Denunciar Comentário"),
        content: TextField(
          controller: reportController,
          decoration: InputDecoration(hintText: "Motivo da denúncia"),
        ),
        actions: <Widget>[
          TextButton(
            child: Text("Cancelar"),
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
          TextButton(
            child: Text("Denunciar"),
            onPressed: () {
              _sendReport(reportController.text, commentId);
              Navigator.of(context).pop();
            },
          ),
        ],
      );
    },
  );
}


Future<void> _sendReport(String motivo, int commentId) async {
  Map<String, dynamic> reportData = {
    'motivo': motivo,
    'comentario': commentId,
    'utilizador': _userId,
  };

  try {
    final response = await ApiService.postData('denuncia/criar', reportData);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Denúncia feita com sucesso.'),
      ),
    );
  } catch (e) {
    print('Erro ao enviar denúncia: $e');
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Erro ao enviar denúncia. Tente novamente.'),
      ),
    );
  }
}



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(),
      body: _isLoadingDetails
          ? Center(
              child: CircularProgressIndicator(),
            )
          : _activityDetails != null
              ? SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _buildActivityItem(_activityDetails!),
                        SizedBox(height: 16),
                        _buildCommentsSection(_comments),
                        SizedBox(height: 16),
                        _buildCommentInput(),
                      ],
                    ),
                  ),
                )
              : Center(child: Text('Nenhum conteúdo disponível')),
      bottomNavigationBar: CustomBottomNavigationBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }


  Widget _buildActivityItem(Map<String, dynamic> item) {
    bool isTypeValid = item['conteudo_tipo']['tipo'] == "Atividade" || item['conteudo_tipo']['tipo'] == "Evento";
    bool isRevisao = false;
    if (item['revisao_conteudo'].length > 0) {
      for (var revisao in item['revisao_conteudo']) {
        if (revisao['estado'] == 1) { // em analise
          isRevisao = true;
        }
      }
    } else {
      isRevisao = true;
    }


    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: _buildDetailItemWithLabel(
                item['titulo'] ?? 'Título não encontrado',
                isTitle: true,
              ),
            ),
            if (isTypeValid && !_isParticipating)
              ElevatedButton(
                onPressed: _confirmParticipation,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'Participar',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            if (isTypeValid && _isParticipating)
              ElevatedButton(
                onPressed: _confirmCancelParticipation,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'Inscrito',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
          ],
        ),
        SizedBox(height: 8),
        Container(
          height: 160,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            image: DecorationImage(
              image: item['imagem'] != null
                  ? (item['imagem'].startsWith('http')
                          ? NetworkImage(item['imagem'])
                          : AssetImage('assets/Images/${item['imagem']}'))
                      as ImageProvider
                  : AssetImage('assets/Images/imageMissing.jpg'),
              fit: BoxFit.cover,
            ),
          ),
        ),
        SizedBox(height: 16),
        _buildDetailItemWithLabel(
          item['endereco'] ?? 'Endereço não encontrado',
        ),
        SizedBox(height: 8),
        Wrap(
          spacing: 8.0, // Espaçamento horizontal entre os chips
          runSpacing: 0.0, // Espaçamento vertical entre as linhas de chips
          children: [
            buildChip(item['conteudo_tipo']['tipo']),
            buildChip(item['conteudo_subtopico']['area']),
            buildChip(item['conteudo_subtopico']['subtopico_topico']['topico']),
          ],
        ),
        SizedBox(height: 16),
        _buildDetailItemLabel('Descrição'),
        _buildDetailItemWithLabel(
          item['descricao'] ?? 'Descrição não encontrada',
          isDescription: true,
        ),
        SizedBox(height: 16),
        if (item['data_evento'] != null)
          _buildDetailItemWithLabel(
            _formatDateTime(item['data_evento']),
          ),
        SizedBox(height: 16),
        if (item['preco'] != null) ...[
          _buildDetailItemLabel('Preço'),
          _buildDetailItemWithLabel('${item['preco']}'),
          SizedBox(height: 16),
        ],
        _buildDetailItemLabel('Criado por'),
        _buildDetailItemWithLabel(
          "${item['conteudo_utilizador']['nome']} ${item['conteudo_utilizador']['sobrenome']} em ${_formatDateTime(item['data_criacao'])}",
          isDescription: true,
        ),
        SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            if (isRevisao) // Usando uma variável booleana para controlar a exibição
              Column(
                children: [
                  IconButton(
                    icon: Icon(Icons.edit),
                    onPressed: () {
                      _navigateToAtividadeEditarPage();
                    },
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Editar',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 12),
                  ),
                ],
              ),
            Column(
              children: [
                IconButton(
                  icon: Icon(Icons.image),
                  onPressed: () {
                    _navigateToAlbumSliderPage();
                  },
                ),
                SizedBox(height: 4),
                Text(
                  'Álbum',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12),
                ),
              ],
            ),
            Column(
              children: [
                  IconButton(
                  icon: Icon(Icons.share),
                  onPressed: () {
                    _shareContent();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text("Atividade copiada, pode colar onde quiser agora"),
                        duration: Duration(seconds: 2),
                      ),
                    );
                  },
                ),
                SizedBox(height: 4),
                Text(
                  'Partilhar',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12),
                ),
              ],
            ),
          ],
        ),
        SizedBox(height: 16),
        if (item['conteudo_tipo']['tipo'] == "Recomendação" ||
            item['conteudo_tipo']['tipo'] == "Atividade" ||
            item['conteudo_tipo']['tipo'] == "Evento" ||
            item['conteudo_tipo']['tipo'] == "Espaço") ...[
          _buildDetailItemLabel('Dê também a sua classificação:'),
          Row(
            children: List.generate(
              5,
              (index) => IconButton(
                icon: Icon(
                  index < (item['classificacao'] ?? 0)
                      ? Icons.star
                      : Icons.star_border,
                  color: Colors.yellow,
                ),
                onPressed: () {
                  _rateContent(widget.activityId, index + 1);
                },
              ),
            ),
          ),
          SizedBox(height: 16),
        ],
      ],
    );
  }

  Widget _buildCommentsSection(List<dynamic>? comments) {
    if (comments == null || comments.isEmpty) {
      return SizedBox.shrink();
    }

    List<dynamic> visibleComments =
        _showAllComments ? comments : [comments.first];

    return Container(
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _buildDetailItemLabel('Comentários'),
          SizedBox(height: 8),
          ListView.builder(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            itemCount: visibleComments.length,
            itemBuilder: (context, index) {
              return _buildCommentItem(visibleComments[index]);
            },
          ),
          if (comments.length > 1)
            TextButton(
              onPressed: () {
                setState(() {
                  _showAllComments = !_showAllComments;
                });
              },
              child: Text(_showAllComments ? 'Ver menos' : 'Ver mais'),
            ),
        ],
      ),
    );
  }

Widget _buildCommentItem(Map<String, dynamic> comment) {
  int commentId = comment['id'];
  var currentUserId = _userId;
  bool isCurrentUserComment = comment['utilizador'] == currentUserId;
  String userName =
      _userMap != null && _userMap!.containsKey(comment['utilizador'])
          ? _userMap![comment['utilizador']]!
          : 'Utilizador desconhecido';
  int userRating = (_userRatings[commentId] ?? 0).toInt();

  return Container(
    padding: EdgeInsets.all(12),
    margin: EdgeInsets.only(bottom: 12),
    decoration: BoxDecoration(
      color: Colors.grey[300],
      borderRadius: BorderRadius.circular(8),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                userName,
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
              ),
            ),
            if (!isCurrentUserComment)
              IconButton(
                icon: Icon(Icons.error),
                onPressed: () => _showReportDialog(commentId),
              ),
            if (isCurrentUserComment)
              IconButton(
              icon: Icon(Icons.delete),
              onPressed: () => _confirmDeleteComment(commentId),
            ),
          ],
        ),
        SizedBox(height: 4),
        Text(
          '${_formatDateTime(comment['data_criacao'])}',
          style: TextStyle(fontSize: 12, fontStyle: FontStyle.italic),
        ),
        SizedBox(height: 8),
        Text(
          comment['comentario'] ?? 'Comentário não disponível',
          style: TextStyle(fontSize: 14),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: List.generate(
            5,
            (index) => IconButton(
              icon: Icon(
                index < userRating ? Icons.star : Icons.star_border,
                color: Colors.yellow,
              ),
              onPressed: () {
                _rateComment(commentId, index + 1);
              },
            ),
          ),
        ),
        
      ],
    ),
  );
}

Widget buildChip(String label) {
  return Chip(
    label: Text(
      label,
      style: TextStyle(
        color: Colors.white,
        fontSize: 14, // Tamanho do texto menor
      ),
    ),
    backgroundColor: Colors.blue,
    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4), // Reduz o padding
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(16), // Bordas arredondadas
    ),
  );
}

  Widget _buildDetailItemWithLabel(String value,
      {bool isTitle = false, bool isDescription = false}) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 6.0),
      child: Text(
        value,
        style: TextStyle(
          fontSize: isTitle
              ? 18
              : isDescription
                  ? 12
                  : 14,
          fontWeight: isTitle ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }

  Widget _buildDetailItemLabel(String label) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 6.0),
      child: Text(
        label,
        style: TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 14,
        ),
      ),
    );
  }

 Widget _buildCommentInput() {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      Container(
        margin: EdgeInsets.only(bottom: 12),
        padding: EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: Colors.grey[300],
          borderRadius: BorderRadius.circular(8),
        ),
        child: TextField(
          controller: _commentController,
          decoration: InputDecoration(
            hintText: 'Adicione um comentário',
            border: InputBorder.none,
          ),
          onChanged: (text) {
            setState(() {
              // Força o rebuild para verificar se o campo está vazio ou não
            });
          },
        ),
      ),
      ElevatedButton(
        onPressed: _commentController.text.trim().isEmpty
            ? null
            : () {
                _postComment().then((_) {
                  setState(() {
                    _fetchActivityDetails(widget.activityId);
                    _commentController.clear();
                  });
                });
              },
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.blue,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        child: Text(
          'Enviar',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    ],
  );
}


  Widget _buildStarRating(int rating) {
    return Row(
      children: List.generate(
        5,
        (index) => Icon(
          index < rating ? Icons.star : Icons.star_border,
          color: Colors.yellow,
        ),
      ),
    );
  }
}
