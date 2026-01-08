package com.revature.smartAppointment.Service;

import java.util.List;
import java.util.Optional;

public interface ServiceInterface<T> {
    T save(T entity);
    Optional<T> findById(int id);
    List<T> findAll();
    Optional<T> deleteById(int id);
    T updateById(int id, T entity);
}
