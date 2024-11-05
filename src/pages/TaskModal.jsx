import React, { useState } from 'react';
import axios from 'axios';

const TaskModal = ({ task, onClose, onTaskUpdated }) => {
    const [status, setStatus] = useState(task.status);
    // const [comment, setComment] = useState('');
    // const [commentsList, setCommentsList] = useState([]);

    // Obtener comentarios al abrir el modal
    // useEffect(() => {
    //     setCommentsList(task.comments || []);
    // }, [task]);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    // const handleCommentChange = (e) => {
    //     setComment(e.target.value);
    // };

    // const handleAddComment = async () => {
    //     if (comment) {
    //         const token = localStorage.getItem('token');
    //         try {
    //             const userId = 2; // Cambia esto para que use el ID del usuario autenticado
    //             const response = await axios.post('http://localhost:5000/api/comments', {
    //                 task_id: task.id,
    //                 user_id: userId, // ID del usuario que agrega el comentario
    //                 comment,
    //             }, {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             });

    //             // Agregar el nuevo comentario a la lista
    //             setCommentsList([...commentsList, { id: response.data.id, comment, user_id: userId }]);
    //             setComment(''); // Limpiar el campo de comentario
    //         } catch (error) {
    //             console.error('Error al agregar el comentario:', error);
    //         }
    //     }
    // };

    const handleSaveStatus = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/tasks/${task.id}`, {
                title: task.title,
                description: task.description,
                assigned_to: task.assigned_to,
                created_by: task.created_by,
                due_date: task.due_date,
                priority: task.priority,
                category: task.category,
                status,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            onTaskUpdated();
            onClose();
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
        }
    };

    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Detalles de la Tarea</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <h5>{task.title}</h5>
                        <p>{task.description}</p>
                        <h6>Asignado a: {task.assigned_name || 'No asignado'}</h6>
                        <h6>Creado por: {task.created_by_name || 'Desconocido'}</h6>
                        <h6>Fecha de Vencimiento: {task.due_date}</h6>
                        <h6>Prioridad: {task.priority}</h6>
                        <h6>Categoría: {task.category}</h6>

                        <div>
                            <h6>Cambiar Estado:</h6>
                            <div>
                                <label>
                                    <input type="radio" value="pending" checked={status === 'pending'} onChange={handleStatusChange} />
                                    Pendiente
                                </label>
                                <label>
                                    <input type="radio" value="in_progress" checked={status === 'in_progress'} onChange={handleStatusChange} />
                                    En Progreso
                                </label>
                                <label>
                                    <input type="radio" value="completed" checked={status === 'completed'} onChange={handleStatusChange} />
                                    Completado
                                </label>
                                <label>
                                    <input type="radio" value="cancelled" checked={status === 'cancelled'} onChange={handleStatusChange} />
                                    Cancelado
                                </label>
                            </div>
                        </div>

                        
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={handleSaveStatus}>
                            Guardar Estado
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
