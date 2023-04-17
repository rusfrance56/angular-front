import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Task} from './task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseURL = "http://localhost:8080/tasks";

  constructor(private httpClient: HttpClient) {
  }

  getList(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.baseURL);
  }

  create(task: Task): Observable<Task>  {
    return this.httpClient.post<Task>(this.baseURL, task);
  }

  update(task: Task): Observable<Task>  {
    return this.httpClient.put<Task>(this.baseURL + '/' + task.id, task);
  }

  getById(id: number): Observable<Task>  {
    return this.httpClient.get<Task>(this.baseURL + '/' + id);
  }

  delete(id: number): Observable<Task>  {
    return this.httpClient.delete<Task>(this.baseURL + '/' + id);
  }
}
