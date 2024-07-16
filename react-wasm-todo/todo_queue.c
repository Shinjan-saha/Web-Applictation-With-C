#include <stdlib.h>
#include <string.h>

typedef struct Node {
    char* task;
    struct Node* next;
} Node;

typedef struct Queue {
    Node* front;
    Node* rear;
} Queue;

Queue* createQueue() {
    Queue* q = (Queue*)malloc(sizeof(Queue));
    q->front = q->rear = NULL;
    return q;
}

void enqueue(Queue* q, const char* task) {
    Node* temp = (Node*)malloc(sizeof(Node));
    temp->task = strdup(task);
    temp->next = NULL;
    if (q->rear == NULL) {
        q->front = q->rear = temp;
        return;
    }
    q->rear->next = temp;
    q->rear = temp;
}

char* dequeue(Queue* q) {
    if (q->front == NULL) {
        return NULL;
    }
    Node* temp = q->front;
    char* task = strdup(temp->task);
    q->front = q->front->next;
    if (q->front == NULL) {
        q->rear = NULL;
    }
    free(temp->task);
    free(temp);
    return task;
}
