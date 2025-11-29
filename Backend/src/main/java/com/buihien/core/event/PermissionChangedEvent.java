package com.buihien.core.event;

import java.util.Set;

public class PermissionChangedEvent {
    private final Set<String> affectedUserNames;
    private final String changeType; // ADD, REMOVE, UPDATE

    public PermissionChangedEvent(Set<String> affectedUserNames, String changeType) {
        this.affectedUserNames = affectedUserNames;
        this.changeType = changeType;
    }

    public Set<String> getAffectedUserNames() {
        return affectedUserNames;
    }

    public String getChangeType() {
        return changeType;
    }
}