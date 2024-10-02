const whitelist = ['ModeratorProPe'];

window.onload = function() {
    loadComments();
    checkForStoredName();
}

function checkForStoredName() {
    const storedName = localStorage.getItem('userName');
    const nameContainer = document.getElementById('nameContainer');
    const userInfo = document.getElementById('userInfo');
    const displayName = document.getElementById('displayName');

    if (storedName) {
        nameContainer.style.display = 'none';
        userInfo.style.display = 'flex';
        displayName.textContent = `Usuario: ${storedName}`;
    } else {
        nameContainer.style.display = 'block';
        userInfo.style.display = 'none';
    }
}

async function saveName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();

    if (name === '') {
        alert('Por favor, ingresa tu nombre');
        return;
    }

    // Verificar si el nombre ya existe
    const nameExists = await checkNameExists(name);
    if (nameExists) {
        alert('Este nombre ya está en uso. Por favor, elige otro.');
        return;
    }

    localStorage.setItem('userName', name);
    await db.collection("users").doc(name).set({ name: name }); // Guardar nombre en la base de datos

    document.getElementById('nameContainer').style.display = 'none';
    document.getElementById('userInfo').style.display = 'block';
    document.getElementById('displayName').textContent = `Usuario: ${name}`;

    alert(`Nombre guardado: ${name}`);
}

async function checkNameExists(name) {
    const userDoc = await db.collection("users").doc(name).get();
    return userDoc.exists;
}

async function resetName() {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
        // Borrar el nombre y comentarios de la base de datos
        await db.collection("comments").where("name", "==", storedName).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete();
            });
        });
        await db.collection("users").doc(storedName).delete();
    }

    localStorage.removeItem('userName');
    document.getElementById('nameContainer').style.display = 'block';
    document.getElementById('userInfo').style.display = 'none';
}

async function addComment() {
    const commentInput = document.getElementById('commentInput');
    const storedName = localStorage.getItem('userName');
    const commentText = commentInput.value.trim();
    const date = new Date();

    if (!storedName) {
        alert('Por favor, ingresa tu nombre antes de comentar');
        return;
    }

    if (commentText === '') {
        alert('El comentario no puede estar vacío');
        return;
    }

    const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();

    await db.collection("comments").add({
        name: storedName,
        commentText: commentText,
        date: serverTimestamp
    }).then(() => {
        commentInput.value = ''; 
        loadComments(); 
    }).catch((error) => {
        console.error("Error agregando comentario: ", error);
    });
}

function loadComments() {
    const commentList = document.getElementById('commentList');
    commentList.innerHTML = '';

    db.collection("comments").orderBy("date", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const commentData = doc.data();
            const formattedDate = commentData.date ? commentData.date.toDate().toLocaleString() : 'Sin fecha';
            const newComment = document.createElement('li');
            newComment.innerHTML = `
                <div class="comment-meta">
                    <strong>${commentData.name}</strong> - ${formattedDate}
                </div>
                <div>${commentData.commentText}</div>
                <button class="reply-btn" onclick="showReplyBox('${doc.id}')">Responder</button>
                <div class="replies" id="replies-${doc.id}"></div>
                <button class="delete-btn" onclick="deleteComment('${doc.id}')">✕</button>
            `;

            const deleteBtn = newComment.querySelector('.delete-btn');
            const storedName = localStorage.getItem('userName');

            if (commentData.name === storedName || isUserInWhitelist(storedName)) {
                deleteBtn.style.display = 'inline-block';
            }

            commentList.appendChild(newComment);
            loadReplies(doc.id);
        });
    }).catch((error) => {
        console.error("Error obteniendo los comentarios: ", error);
    });
}

function showReplyBox(commentId) {
    const replyBox = document.createElement('div');
    replyBox.innerHTML = `
        <textarea class="respuesta-comment" id="replyInput-${commentId}" rows="2" placeholder="Escribe una respuesta..."></textarea>
        <button class="respuesta-button" onclick="addReply('${commentId}')">Enviar Respuesta</button>
    `;
    document.getElementById(`replies-${commentId}`).appendChild(replyBox);
}

async function addReply(commentId) {
    const replyInput = document.getElementById(`replyInput-${commentId}`);
    const storedName = localStorage.getItem('userName');
    const replyText = replyInput.value.trim();

    if (!storedName) {
        alert('Por favor, ingresa tu nombre antes de responder');
        return;
    }

    if (replyText === '') {
        alert('La respuesta no puede estar vacía');
        return;
    }

    const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();

    await db.collection("comments").doc(commentId).collection("replies").add({
        name: storedName,
        replyText: replyText,
        date: serverTimestamp
    }).then(() => {
        replyInput.value = ''; 
        loadReplies(commentId); 
    }).catch((error) => {
        console.error("Error agregando respuesta: ", error);
    });
}

function loadReplies(commentId) {
    const repliesContainer = document.getElementById(`replies-${commentId}`);
    repliesContainer.innerHTML = '';

    db.collection("comments").doc(commentId).collection("replies").orderBy("date", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const replyData = doc.data();
            const formattedDate = replyData.date ? replyData.date.toDate().toLocaleString() : 'Sin fecha';
            const newReply = document.createElement('div');
            newReply.classList.add('reply');
            newReply.innerHTML = `
                <div class="comment-meta">
                    <strong>${replyData.name}</strong> - ${formattedDate}
                </div>
                <div>${replyData.replyText}</div>
                <button class="delete-reply-btn" onclick="deleteReply('${commentId}', '${doc.id}')">✕</button>
            `;

            const deleteReplyBtn = newReply.querySelector('.delete-reply-btn');
            const storedName = localStorage.getItem('userName');

            if (replyData.name === storedName || isUserInWhitelist(storedName)) {
                deleteReplyBtn.style.display = 'inline-block';
            }

            repliesContainer.appendChild(newReply);
        });
    }).catch((error) => {
        console.error("Error obteniendo las respuestas: ", error);
    });
}

function deleteReply(commentId, replyId) {
    db.collection("comments").doc(commentId).collection("replies").doc(replyId).delete().then(() => {
        loadReplies(commentId);  // Recargar las respuestas después de eliminar una
    }).catch((error) => {
        console.error("Error eliminando la respuesta: ", error);
    });
}

function deleteComment(commentId) {
    const storedName = localStorage.getItem('userName');

    db.collection("comments").doc(commentId).get().then((doc) => {
        const commentData = doc.data();
        if (commentData.name === storedName || isUserInWhitelist(storedName)) {
            db.collection("comments").doc(commentId).delete().then(() => {
                loadComments();  
            }).catch((error) => {
                console.error("Error eliminando comentario: ", error);
            });
        } else {
            alert('Solo el creador del comentario o un administrador pueden eliminarlo');
        }
    });
}

function isUserInWhitelist(username) {
    return whitelist.includes(username);
}